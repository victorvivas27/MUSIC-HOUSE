# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Copiamos archivos principales
COPY package.json .
COPY package-lock.json .
COPY .env.production .env.production

RUN npm install

# Copiamos el resto del código fuente
COPY . .

ENV NODE_ENV=production

# Ejecutamos el build de Vite
RUN npm run build

# Etapa final: usar Nginx para servir archivos estáticos
FROM nginx:alpine

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el build generado
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]