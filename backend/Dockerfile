# backend/Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build


CMD ["npm", "run", "start:dev"]
