FROM node:lts-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN npm ci --include=dev

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS builder 

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine AS production

RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]