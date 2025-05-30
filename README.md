# 📝 Blog App – Fullstack Web Project

Un blog moderne avec **NestJS** (backend) et **Next.js 15** (frontend) construit dans le cadre de l'évaluation technique d'Akieni.

## 🌐 Démo

🔗 [Démo en ligne (Vercel)](https://your-app.vercel.app) *(Remplace ce lien par ton URL)*  
🔗 [API Swagger en ligne (Render)](https://blog-app-dton.onrender.com/api/v1)*

🛠️ À propos de l’hébergement Render
       Le backend de ce projet est déployé sur Render, un service cloud moderne similaire à Heroku.
Il permet un déploiement continu (CI/CD) à partir de GitHub, avec un hébergement gratuit ou payant, la gestion automatique des bases de données PostgreSQL, et une exposition rapide d'APIs sécurisées (comme la documentation Swagger dans ce projet).

⚠️ Note : Lorsqu’aucune requête n’est envoyée pendant un moment, l’application peut "dormir" (comme Heroku), ce qui peut entraîner un délai de démarrage de quelques secondes à la première requête.
  
---

## ✨ Aperçu visuel

### 🖼️ Frontend (Next.js)

![Aperçu Frontend – Accueil](./screenshots/frontend-home.png)
*Page d’accueil avec liste des articles*

![Aperçu Frontend – Login](./screenshots/frontend-login.png)
*Interface de connexion*

---

### 🖼️ Backend (Swagger & Admin)

![Swagger UI](./screenshots/swagger-docs.png)
*Documentation Swagger – API sécurisée*

![Admin – Création article](./screenshots/admin.png)
*Interface admin  c*

---

## ⚙️ Tech Stack

### Backend
- 🚀 NestJS + PostgreSQL + TypeORM
- 🔐 JWT Auth avec rôles (`admin`, `user`)
- 📦 Swagger pour la documentation API

### Frontend
- ⚡ Next.js 15 
- 🎨 UI moderne responsive avec Tailwind CSS
- 🔒 Authentification via JWT

---

## 🧩 Fonctionnalités

### Public
- 📰 Liste des articles (pagination)
- 📖 Page de détail d’un article
- 💬 Voir les commentaires

### Auth
- 🔐 Inscription / Connexion (JWT)
- ✏️ Seuls les utilisateurs connectés peuvent commenter
- 👨‍💼 Seuls les admins peuvent créer des articles

### Admin
- 📝 Formulaire de création d’articles

---

## 🛠️ Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/mboulombre/blog-app.git
cd blog-app
cp .env.dist .env
docker compose up -d
