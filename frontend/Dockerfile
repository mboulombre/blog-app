# Utilise une version récente compatible avec Next.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /src

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances

RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "dev"]

