ARG NODE_VERSION=24.12-alpine

# Build stage
FROM node:${NODE_VERSION} AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Dev environment
FROM node:${NODE_VERSION} AS dev

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

EXPOSE 5173
CMD ["npm","run","dev"]

# Production environment
FROM nginx:stable-alpine AS prod

WORKDIR /app

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]