FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --frozen-lockfile

COPY . .

RUN mkdir -p /app/client/public \
  && if [ -f /app/cpi_forecast.json ]; then cp /app/cpi_forecast.json /app/client/public/cpi_forecast.json; fi \
  && if [ -f /app/ppi_forecast.json ]; then cp /app/ppi_forecast.json /app/client/public/ppi_forecast.json; fi

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV BILLING_DB_PATH=/app/data/billing.sqlite
ENV GISTIFY_DB_PATH=/app/data/gistify.sqlite
ENV GISTIFY_MIGRATIONS_DIR=/app/server/db/migrations

RUN mkdir -p /app/data
RUN apk add --no-cache python3 py3-pip curl

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/client/public ./client/public
COPY --from=build /app/server/db/migrations ./server/db/migrations
COPY --from=build /app/server/i18n ./server/i18n
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/dailyreport ./dailyreport
COPY --from=build /app/earningreport ./earningreport
COPY --from=build /app/flow ./flow
COPY --from=build /app/momentum ./momentum
COPY --from=build /app/reports/coverage ./reports/coverage

EXPOSE 3000

CMD ["node", "dist/index.js"]
