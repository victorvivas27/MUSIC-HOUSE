# Etapa de construcción
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de runtime
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copiamos el build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Agregamos envsubst para reemplazar variables en tiempo de ejecución
RUN apk add --no-cache gettext

EXPOSE 8080
CMD ["/bin/sh", "-c", "envsubst '$PORT $API_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
