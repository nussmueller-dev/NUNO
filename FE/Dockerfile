FROM nginx:alpine AS base
WORKDIR /app
EXPOSE 80

FROM node:16-alpine AS build
WORKDIR /src
COPY . .
RUN npm install -g @angular/cli
RUN npm ci
RUN ng build

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /src/dist/nuno .
COPY ./Nginx/nginx.conf /etc/nginx/
