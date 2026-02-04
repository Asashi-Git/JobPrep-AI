# Instruction to build the Frontend image
FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development
RUN npm ci 

COPY . .

EXPOSE 3000
CMD ["npm", "start" ]

FROM base AS build
RUN npm ci 
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]