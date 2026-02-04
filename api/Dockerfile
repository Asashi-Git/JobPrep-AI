FROM node:lts-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN npm ci --include=dev

COPY . .

CMD ["npm", "run", "dev"]

FROM base AS deps-prod

RUN npm ci --omit=dev

FROM node:lts-alpine AS production

RUN apk add --no-cache curl

RUN addgroup -g 1001 -S nodejs && adduser -S expressjs -u 1001 -G nodejs

WORKDIR /app

COPY --from=deps-prod --chown=expressjs:nodejs /app/node_modules ./node_modules

COPY --chown=expressjs:nodejs ./src ./src 
COPY --chown=expressjs:nodejs package*.json ./

USER expressjs

CMD ["node", "src/server.js"]