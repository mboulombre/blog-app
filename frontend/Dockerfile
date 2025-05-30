
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build


CMD ["npm", "run", "start:dev"]
FROM node:18-alpine

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances et installe
COPY package*.json ./
RUN npm install

# Copie le reste de l'application
COPY . .

# Build de l'app
RUN npm run build



# Lance l'application
CMD ["npm", "start"]
