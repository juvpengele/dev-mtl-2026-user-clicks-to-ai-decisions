using './main.bicep'

param namePrefix = 'project-x-demo'
param appImage = '<registry>.azurecr.io/project-x:latest'
param collectorImage = '<registry>.azurecr.io/project-x-collector:latest'
param appOrigin = 'https://<replace-after-first-deployment>'
