# Usar una imagen base de Node.js
FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de package.json
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY backend/ ./
COPY frontend/ ./frontend/

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
