FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY shared/package.json shared/package.json
COPY v2-nextjs/package.json v2-nextjs/package.json
RUN npm ci

FROM dependencies AS builder
WORKDIR /app
COPY shared ./shared
COPY v2-nextjs ./v2-nextjs
ARG NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
ENV NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT=$NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT
RUN npm run build -w v2-nextjs

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN mkdir -p /data && chown node:node /data
COPY --from=builder --chown=node:node /app/v2-nextjs/.next/standalone ./
COPY --from=builder --chown=node:node /app/v2-nextjs/.next/static ./v2-nextjs/.next/static
COPY --from=builder --chown=node:node /app/v2-nextjs/public ./v2-nextjs/public
USER node
EXPOSE 3000
CMD ["node", "v2-nextjs/server.js"]
