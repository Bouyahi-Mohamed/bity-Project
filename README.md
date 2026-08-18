# Bity - Plateforme de Logement Étudiant en Tunisie

Bity est une plateforme sécurisée facilitant la recherche et la location de logements pour les étudiants en Tunisie (ex: Sesame, Esprit, Dauphine, etc.). L'application intègre un backend Node.js/Express relié à une base de données MongoDB, et 4 modules frontends développés en React/Vite.

---

## 📂 Structure du Projet

Le projet est organisé sous forme de monorepo simplifié composé des dossiers suivants :

- **`backend/`** : API REST Node.js, Express, Mongoose (MongoDB).
- **`bity-login-and-singup/`** : Module d'authentification et d'inscription (Port `3000`).
- **`bity-espace-etudiant/`** : Espace étudiant (Recherche intelligente, notifications, etc.) (Port `3001`).
- **`bity-espace-propritaire/`** : Espace propriétaire (CRUD des annonces, Ranking Intelligent) (Port `3002`).
- **`bity-espace-admin/`** : Espace d'administration (File de validation, statistiques, modération) (Port `3003`).

---

## 🛠️ Pré-requis

Assurez-vous d'avoir installé les éléments suivants sur votre machine :
- **Node.js** (v18 ou supérieur recommandé)
- **npm** (inclus avec Node.js)
- **MongoDB** (exécuté localement sur le port par défaut `27017`)

---

## 🔄 Flux Utilisateur Complet

| Étape | Action | URL |
|-------|--------|-----|
| 1 | Connexion / Inscription | `http://localhost:3000` |
| 2 | Choisir rôle (Étudiant ou Propriétaire) | → `/profiles` |
| 3 | Uploader les documents de vérification | → `/verify-student` ou `/verify-landlord` |
| 4 | Remplir les détails personnels + créer mot de passe | → `/personal-details` |
| 5 | Compte créé → En attente de validation admin | → `/dashboard` (en attente) |
| 6 | **Admin** valide le compte sur | `http://localhost:3003` |
| 7 | L'utilisateur se reconnecte → redirigé vers son espace | `3001` (étudiant) ou `3002` (propriétaire) |

---

## ⚙️ Configuration du Projet

### 1. Variables d'environnement du Backend
Créez un fichier `.env` dans le dossier `backend/` (vous pouvez copier le fichier `backend/.env.example`) :
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bity
JWT_SECRET=bity_super_secret_key_12345
```

---

## 🚀 Démarrage Rapide

Pour lancer l'intégralité de l'application en une seule commande depuis la racine du projet :

### Étape 1 : Installer toutes les dépendances (Racine et sous-projets)
Ouvrez un terminal à la racine de votre espace (`project bity/`) et lancez :
```bash
npm run install:all
```
*Cette commande installera les dépendances du projet principal, du backend et des 4 applications frontend.*

### Étape 2 : Lancer la base de données MongoDB
Assurez-vous que votre serveur MongoDB local est démarré sur le port `27017`.
- **Sur Windows (via PowerShell sans privilèges d'administrateur)**, vous pouvez démarrer MongoDB en mode utilisateur avec :
  ```powershell
  mongod --dbpath "D:\code\project bity\mongodb_data" --port 27017
  ```

### Étape 3 : Démarrer l'ensemble des serveurs
Lancez la commande suivante à la racine :
```bash
npm run dev
```
*Grâce au script global, cette commande démarre simultanément le serveur backend (port `5000`), le portail de connexion (port `3000`), l'espace étudiant (port `3001`), l'espace propriétaire (port `3002`) et l'espace admin (port `3003`).*

---

## 🔐 Identifiants par Défaut (Super-Admin) & Comptes de Test

Au premier démarrage du serveur, un compte Administrateur de test est automatiquement créé en base de données :
- **Adresse e-mail** : `admin@admin.com`
- **Mot de passe** : `admin`

### 🎓 Compte Étudiant de Test
- **Adresse e-mail** : `bouyahi.mohamed.1@gmail.com`
- **Mot de passe** : `Mohamed007`

### 🏠 Compte Propriétaire de Test
- **Adresse e-mail** : `nourdine@gmail.com`
- **Mot de passe** : `Mohamed007`


---

## 🧪 Exécution des Tests d'Intégration de l'API

Pour valider le bon fonctionnement de l'ensemble des routes de l'API (Inscription avec téléversement de documents, blocage si non vérifié, validation de compte par l'admin, publication avec prix obligatoire, recherche multicritères et notifications de baisse de prix) :

1. Assurez-vous que le serveur backend est en cours d'exécution.
2. Ouvrez un terminal dans le dossier `backend/` et lancez :
   ```bash
   npx tsx "C:\Users\bouya\.gemini\antigravity\brain\20027800-f75b-4343-834a-5ef6392db7a1\scratch\test_api.js"
   ```

---

## ✅ TODO — Connexion à la Base de Données

Cette section liste toutes les fonctionnalités à connecter à la base de données réelle.
- ✅ = déjà branché sur le backend MongoDB
- 🔲 = encore en données fictives (mock) — à implémenter

---

### 🎓 Espace Étudiant (`bity-espace-etudiant` — Port 3001)

#### Annonces & Recherche
- ✅ Récupération de la liste des annonces depuis `/api/ads`
- ✅ Affichage des détails d'une annonce depuis `/api/ads/:id`
- ✅ Filtres de recherche (prix, type, distance) branchés sur le backend
- ✅ Carte Leaflet avec localisation géographique des annonces
- ✅ Section colocation : colocataires, avatars photos, noms depuis la BDD
- ✅ 3 statuts de chambre (🔴 Occupée, 🟠 Sortie avec préavis, 🟢 Libre) depuis `roommates.avatars[]`
- 🔲 **Favoris** : enregistrer/supprimer un favori (`POST /api/favorites`)
- 🔲 **Historique de recherche** : sauvegarder les recherches récentes de l'étudiant
- 🔲 **Notifications de baisse de prix** : brancher les alertes sur `/api/notifications`

#### Profil Étudiant
- 🔲 **Page profil** (`/profile`) : charger les vraies infos depuis `/api/users/me`
- 🔲 **Modifier le profil** : `PUT /api/users/me` (nom, photo, université, etc.)
- 🔲 **Upload photo de profil** : stocker l'image et mettre à jour l'URL en base
- 🔲 **Profil public colocataire** (`/student/:name`) : charger depuis `/api/users/:username`

#### Dossier & Candidature
- 🔲 **Déposer un dossier** : `POST /api/applications` avec documents joints
- 🔲 **Suivi des candidatures** : lister les dossiers envoyés et leur statut
- 🔲 **Messagerie propriétaire** : `POST /api/messages` pour contacter un propriétaire

#### Section Colocation — Images des Chambres (PropertyDetails.tsx)
> ⚠️ **TODO IMPORTANT** : Dans `bity-espace-etudiant/src/pages/PropertyDetails.tsx`, les images des chambres individuelles (Chambre 1, 2, 3) sont actuellement des **images fictives Unsplash** (tableau `fakeRoomImages`).
>
> **À faire lors du branchement de l'Espace Propriétaire :**
> - Le propriétaire doit pouvoir uploader une photo par chambre lors de la création/édition d'une annonce de colocation.
> - Ces URLs d'images doivent être stockées dans le modèle `Ad` → `roommates.roomImages: [String]` (à ajouter au schéma Mongoose).
> - Dans `PropertyDetails.tsx`, remplacer `fakeRoomImages[i % fakeRoomImages.length]` par `property.roommates.roomImages?.[i]` avec fallback sur une image placeholder.
>
> **Schéma MongoDB à mettre à jour (`backend/src/models/Ad.ts`) :**
> ```ts
> roommates: {
>   count: Number,
>   details: String,
>   avatars: [String],       // statut et photo de profil du colocataire
>   roomImages: [String],    // TODO: photo de chaque chambre (index = numéro chambre)
> }
> ```

---

### 🏠 Espace Propriétaire (`bity-espace-propritaire` — Port 3002)

> 💡 **Note :** Toutes les données de l'espace propriétaire doivent être fetchées depuis la base de données MongoDB via l'API backend (`http://localhost:5000`). Le JWT du propriétaire est nécessaire pour toutes les routes protégées.

#### Tableau de Bord — Données à fetcher depuis la BDD
- 🔲 **Mes annonces** : `GET /api/ads?owner=me` — liste des annonces du propriétaire connecté
  - Titre, type, prix, statut (`ACTIVE` / `PÉRIMÉE` / `SIGNALÉE`), date de création
  - Nombre de candidatures reçues par annonce
  - Score de ranking (`rankingScore`, `rankingCount`) affiché sur chaque annonce
- 🔲 **Statistiques** : nombre total de vues, de candidatures, de messages reçus
- 🔲 **Profil propriétaire** : nom, photo, score global, avis reçus

#### Gestion des Annonces — CRUD complet
- 🔲 **Créer une annonce** : `POST /api/ads`
  - Champs obligatoires : `title`, `description`, `price`, `surface`, `type`
  - Upload des **photos du logement** (galerie)
  - **Localisation** : pin sur carte → enregistre `latitude`, `longitude`, `address`, `neighborhood`, `city`
  - Si `type = "Chambre en colocation"` :
    - Nombre de chambres (`roommates.count`)
    - Pour chaque chambre : nom du colocataire, photo de profil, **photo de la chambre**, statut (`URL` / `LEAVING:URL` / `FREE`)
    - Ces données alimentent `roommates.avatars[]` et `roommates.roomImages[]`
- 🔲 **Modifier une annonce** : `PUT /api/ads/:id`
  - Même formulaire que la création, pré-rempli avec les données existantes
  - Possibilité de mettre à jour le statut d'une chambre (ex: chambre occupée → préavis → libre)
- 🔲 **Supprimer une annonce** : `DELETE /api/ads/:id`
- 🔲 **Changer le statut** : `PATCH /api/ads/:id/status` → `ACTIVE` / `PÉRIMÉE` / `SIGNALÉE`

#### Gestion des Chambres en Colocation
> Ces données sont directement liées à la section "Description des chambres" affichée dans `PropertyDetails.tsx` (Espace Étudiant).
>
> Le propriétaire doit pouvoir depuis son espace :
- 🔲 **Marquer une chambre comme "Préavis déposé"** : modifier le préfixe `LEAVING:` + définir la date de sortie
- 🔲 **Marquer une chambre comme "Libre"** : mettre la valeur `FREE` dans `roommates.avatars[i]`
- 🔲 **Associer un nouveau colocataire** à une chambre libre après réservation acceptée
- 🔲 **Uploader la photo d'une chambre** → stockée dans `roommates.roomImages[i]`

#### Candidatures Reçues
- 🔲 **Voir les dossiers reçus** : `GET /api/applications?ad=:id`
  - Nom de l'étudiant, université, documents joints, date d'envoi, statut
- 🔲 **Accepter** un dossier : `PUT /api/applications/:id` → `{ status: "ACCEPTED" }`
- 🔲 **Refuser** un dossier : `PUT /api/applications/:id` → `{ status: "REJECTED" }`
- 🔲 **Contacter l'étudiant** via la messagerie interne

#### Messagerie
- 🔲 **Conversations** : `GET /api/messages?with=:userId`
- 🔲 **Répondre** : `POST /api/messages`

---

### 🛡️ Espace Admin (`bity-espace-admin` — Port 3003)

- ✅ Validation / rejet des comptes en attente
- 🔲 **Statistiques globales** : annonces, utilisateurs, candidatures (`GET /api/admin/stats`)
- 🔲 **Modération** : lister les annonces avec `status: SIGNALÉE`
- 🔲 **Gestion des utilisateurs** : suspendre / activer un compte

---

### 🔧 Backend & Infrastructure

- ✅ Modèle `Ad` avec géolocalisation (`latitude`, `longitude`, `address`, `neighborhood`, `city`)
- ✅ Modèle `User` avec rôles (`student`, `owner`, `admin`) et score propriétaire
- ✅ Seed script (`backend/scripts/seed_db.ts`) avec 5 annonces géolocalisées + comptes de test
- ✅ Avatars des colocataires stockés en URLs dans `roommates.avatars[]`
- ✅ Routes publiques `GET /api/ads` et `GET /api/ads/:id` (sans authentification requise)
- 🔲 **`roommates.roomImages[]`** : ajouter ce champ au schéma `Ad` pour les photos de chaque chambre
- 🔲 **Route `/api/users/:username`** : récupérer un profil public par username
- 🔲 **Route `/api/favorites`** : CRUD des favoris liés à un étudiant
- 🔲 **Route `/api/applications`** : gestion complète des dossiers de candidature
- 🔲 **Route `/api/messages`** : messagerie interne étudiant ↔ propriétaire
- 🔲 **Upload d'images** : améliorer le stockage (Cloudinary ou dossier local `/uploads`)
- 🔲 **Pagination** sur `GET /api/ads` pour les grandes listes d'annonces

---

## 🗺️ Modèle de données — Schéma `Ad` (MongoDB)

```ts
// backend/src/models/Ad.ts (état actuel + champs TODO)
{
  title: String,
  description: String,
  price: Number,
  surface: Number,
  type: 'Logement entier' | 'Chambre en colocation',
  location: String,
  address: String,
  neighborhood: String,
  city: String,
  latitude: Number,
  longitude: Number,
  image: String,           // photo principale du logement
  features: [String],
  roommates: {
    count: Number,
    details: String,       // "Faten, Farah • Étudiantes"
    avatars: [String],     // ["https://...", "LEAVING:https://...", "FREE"]
    roomImages: [String],  // TODO: ["url_chambre1", "url_chambre2", "url_chambre3"]
  },
  owner: ObjectId,         // ref User
  status: 'ACTIVE' | 'PÉRIMÉE' | 'SIGNALÉE',
  rankingScore: Number,
  rankingCount: Number,
}
```
