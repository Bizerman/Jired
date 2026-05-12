# Этап сборки React-приложения
FROM node:18-alpine AS build
WORKDIR /app

# Отключаем загрузку Cypress (он не нужен для production-сборки)
ENV CYPRESS_INSTALL_BINARY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Этап production – лёгкий образ с nginx
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]