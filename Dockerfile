FROM node:20-alpine
WORKDIR /app

# Copiamos las dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto de los archivos del frontend
COPY . .

# Arrancamos el servidor usando el script "start" de tu package.json
CMD ["npm", "start"]