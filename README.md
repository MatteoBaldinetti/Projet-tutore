# Pretetgo - Plateforme de Réservation de Salles et Matériel (MMI)

Pretetgo est une application web complète (Full-Stack) conçue pour la gestion et la réservation de salles et de matériel, spécialement pensée pour le département MMI (Métiers du Multimédia et de l'Internet).

## 🚀 Fonctionnalités Principales

### 👨‍🎓 Espace Étudiant / Utilisateur
*   **Catalogue de Matériel :** Consulter la liste des équipements disponibles.
*   **Réservation de Matériel :** Réserver des équipements spécifiques pour une durée définie.
*   **Salles :** Consulter les détails des salles, leurs équipements et vérifier leurs disponibilités via un calendrier intégré.

### 🛡️ Espace Administrateur
Gestion complète de l'écosystème via des tableaux de bord dédiés :
*   **Utilisateurs :** Étudiants et Professeurs.
*   **Ressources :** Salles (Classrooms), Types de Salles, Matériel (Items), Types de Matériel.
*   **Pédagogie :** Matières (Subjects), Tags.
*   **Exploitation :** Réservations, Signalements (Reports), Notifications.

## 🛠️ Stack Technique

### Frontend (`/web`)
*   **Framework :** React 18 avec Vite
*   **Langage :** TypeScript
*   **Styling :** Tailwind CSS (v4) + CSS personnalisé
*   **Routage :** React Router DOM
*   **Composants UI interactifs :** Swiper (pour les galeries d'images)

### Backend (`/api`)
*   **Framework :** Spring Boot (Java)
*   **Base de données :** MySQL
*   **ORM :** Spring Data JPA / Hibernate
*   **Mapping :** MapStruct
*   **Documentation API :** Swagger / Springdoc OpenAPI
*   **Outils :** Lombok, Maven

### Infrastructure & Déploiement (`/docker`)
*   **Conteneurisation :** Docker & Docker Compose
*   **Services configurés :**
    *   Base de données MySQL (`pretetgo-db`)
    *   API Backend (`pretetgo-api`)
    *   Volume persistant pour les base de données et les uploads de fichiers.

## 📂 Structure du Projet

```text
Projet-tutore/
├── api/                  # Code source du backend (Spring Boot / Java)
│   ├── src/main/java/    # Logique métier, contrôleurs, entités, services
│   └── pom.xml           # Configuration Maven
├── web/                  # Code source du frontend (React / Vite / TS)
│   ├── src/
│   │   ├── components/   # Composants réutilisables (Layout, ImageSlider, RoomCard...)
│   │   ├── contexts/     # Contextes React (AuthContext...)
│   │   ├── pages/        # Vues principales (Login, RoomDetails, Admin, Student...)
│   │   └── styles/       # Fichiers CSS (Tailwind, Swiper custom, etc.)
│   ├── package.json      # Dépendances NPM
│   └── tailwind.config.* # Configuration Tailwind
├── docker/               # Fichiers de configuration pour le déploiement local
│   └── compose.yaml      # Configuration Docker Compose
└── README.md             # Ce fichier
```

## 🏍️ Lancement Rapide (Local)

### 1. Démarrer la base de données et l'API via Docker

Assurez-vous d'avoir [Docker](https://www.docker.com/) installé sur votre machine.

```bash
cd docker
docker compose up -d
```
Ceci va démarrer :
*   La base de données MySQL sur le port `3306`.
*   Le serveur API Spring Boot sur le port `8080`.

*(Note : Si vous préférez lancer l'API manuellement sans Docker, vous pouvez aller dans le dossier `/api` et utiliser Maven : `./mvnw spring-boot:run` en vous assurant qu'une base de données locale est configurée).*

### 2. Démarrer le Frontend (Mode Développement)

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé.

```bash
cd web
npm install
npm run dev
```
Le frontend sera accessible à l'adresse indiquée dans votre terminal (généralement `http://localhost:5173`).

## 📚 Documentation API

Une fois le backend démarré, la documentation interactive de l'API (Swagger UI) est accessible à l'adresse suivante :  
👉 `http://localhost:8080/swagger-ui/index.html` (port par défaut, modifiez-le si nécessaire).
