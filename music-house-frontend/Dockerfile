# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Copiamos archivos desde la carpeta del frontend (visto desde la raíz del repo)
COPY music-house-frontend/package.json .
COPY music-house-frontend/package-lock.json ./
#COPY music-house-frontend/.env.production .env.production

RUN npm install

# Copiamos el resto del código fuente
COPY music-house-frontend ./

ENV NODE_ENV=production

# Ejecutamos el build de Vite
RUN npm run build

# Etapa final: usar Nginx para servir archivos estáticos
FROM nginx:alpine

# Configuración personalizada de Nginx
COPY music-house-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el build generado
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]