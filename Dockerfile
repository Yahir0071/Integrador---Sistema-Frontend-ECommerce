FROM node:20-alpine
WORKDIR /app

# Copiamos las dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto de los archivos del frontend
COPY . .

# Configuración de red para contenedor Docker (sobrescribible al ejecutar)
ENV HOST=0.0.0.0
ENV PORT=4200
ENV API_TARGET=http://backend:8080

EXPOSE 4200

# Arrancamos el servidor usando el script "start" de tu package.json
CMD ["npm", "start"]