@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Short, globally unique suffix for resource names.')
param namePrefix string = 'project-x'

@description('Prebuilt Project X application image.')
param appImage string

@description('Prebuilt Collector image containing collector.cloud.yaml.')
param collectorImage string

@description('Public origin allowed to send browser OTLP, for example https://project-x.example.com.')
param appOrigin string

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${namePrefix}-logs'
  location: location
  properties: {
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${namePrefix}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${namePrefix}-environment'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource app 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${namePrefix}-app'
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
        allowInsecure: false
      }
      secrets: [
        {
          name: 'application-insights-connection-string'
          value: appInsights.properties.ConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'project-x'
          image: appImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'DATABASE_PATH', value: '/data/project-x.sqlite' }
            { name: 'EVENTS_QUERY_MODE', value: 'n_plus_one' }
            { name: 'SIMULATED_DB_LATENCY_MS', value: '5' }
            { name: 'DEPLOYMENT_ENVIRONMENT', value: 'conference' }
            { name: 'OTEL_SERVICE_NAME', value: 'project-x' }
            { name: 'OTEL_EXPORTER_OTLP_ENDPOINT', value: 'http://localhost:4318' }
          ]
        }
        {
          name: 'otel-collector'
          image: collectorImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              secretRef: 'application-insights-connection-string'
            }
            { name: 'APP_ORIGIN', value: appOrigin }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

output applicationUrl string = 'https://${app.properties.configuration.ingress.fqdn}'
output applicationInsightsName string = appInsights.name
