# NDI2K26 - Nuit du Code 2026

Ce projet a été réalisé dans le cadre de la **Nuit du Code édition 2026**. Il s'agit d'une application (Web & Mobile) permettant de recenser et de visualiser des projets solidaires, culturels et environnementaux soutenus par le Crédit Agricole dans les départements du Var (83), des Alpes-Maritimes (06) et des Alpes-de-Haute-Provence (04).

## 🚀 Structure du Projet

Le dépôt est divisé en deux parties principales :

* **`backend/`** : API REST construite avec Node.js et Express.
* **`credit_agricole/`** : Application mobile développée avec Expo et React Native.

---

## 🛠️ Backend (Express & Sequelize)

Le serveur gère l'authentification des utilisateurs, la gestion des projets et l'hébergement des images associées.

### Technologies utilisées

* **Framework** : Express.js
* **ORM** : Sequelize (avec MySQL/MariaDB)
* **Documentation** : Swagger UI
* **Moteur de templates** : EJS

### Installation et Démarrage

1. Allez dans le dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Configurez votre accès MySQL dans `models/index.js` ou via les variables d'environnement.
4. Lancez le serveur en mode développement : `npm run dev`

> **Note :** Au démarrage, le serveur crée automatiquement la base de données `CreditAgricole` si elle n'existe pas et insère un jeu de données de test (utilisateurs, projets et images).

### Endpoints principaux

* `GET /api-docs` : Documentation Swagger complète de l'API.
* `/api/utilisateurs` : Gestion des comptes (Admin/User).
* `/api/projets` : Liste et détails des projets solidaires.
* `/api/images` : Gestion des médias liés aux projets.

---

## 📱 Application Mobile (Expo)

L'application permet aux utilisateurs de naviguer entre les actualités, une carte interactive des projets et leurs paramètres personnels.

### Technologies utilisées

* **Framework** : Expo / React Native
* **Navigation** : Expo Router (système basé sur les fichiers)
* **Cartographie** : React Native Maps
* **Composants** : React Native Reanimated, Bottom Sheet, Lucide (IconSymbol)

### Installation et Démarrage

1. Allez dans le dossier mobile : `cd credit_agricole`
2. Installez les dépendances : `npm install`
3. Lancez l'application : `npx expo start`
4. Utilisez l'application sur iOS, Android ou Web via les commandes dédiées (`i`, `a`, ou `w`).

### Fonctionnalités

* **Authentification** : Écrans de connexion et d'inscription.
* **Carte** : Visualisation géographique des projets.
* **Actualités** : Flux des derniers projets et initiatives.
* **Interface adaptative** : Support du mode clair/sombre et retour haptique.

---

## 📂 Organisation des fichiers

* **`backend/models/`** : Définition des schémas de données (Utilisateur, Projet, Image).
* **`backend/public/images/projets/`** : Stockage des illustrations des projets.
* **`credit_agricole/app/(tabs)/`** : Structure principale de l'interface mobile par onglets.

---

*Développé pour la Nuit du Code 2026.*
