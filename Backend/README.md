# Bureau d'Ordre — Backend API

API REST ASP.NET Core 10 pour la gestion électronique du courrier avec OCR, classification automatique et contrôle d'accès basé sur les rôles.

## Fonctionnalités

- **Authentification JWT** (30 min d'expiration, HMAC-SHA256, mots de passe hashés avec BCrypt)
- **Contrôle d'accès** par rôles : Administrateur, Super Agent, Agent, Lecteur
- **CRUD courriers** entrants/sortants avec pièces jointes
- **Pipeline OCR** : extraction Tesseract → classification par règles (8 catégories)
- **Notifications** in-app avec marquage lu/non lu
- **Tableaux de bord** : Admin, Agent, Super Agent, Lecteur
- **Réaffectation** de courriers (Super Agent / Admin)
- **Recherche** full-text avec filtres multiples
- **Historique** des changements de statut avec traçabilité
- **Rapports** de synthèse

## Technologies

| Technologie | Version |
|---|---|
| ASP.NET Core | 10.0 |
| Npgsql (PostgreSQL) | 10.0.2 |
| Entity Framework (via procédures stockées) | — |
| BCrypt.Net-Next | 4.1.0 |
| Tesseract OCR | 5.2.0 |
| Swashbuckle (Swagger) | 9.0.6 |
| JWT Bearer | 10.0.6 |
| PostgreSQL | 15 (Docker) |

## Structure du projet

```
Backend/
├── Presentation/           # API REST (Controllers, Middleware, DI)
│   ├── Controllers/        # 10 contrôleurs (Auth, Courrier, Users, etc.)
│   ├── Services/           # OCR Tesseract + Classification par règles
│   ├── Authorization/      # Policies personnalisées (OwnerOrAdmin)
│   ├── Mappings/           # Mapping DTO manuel
│   ├── Program.cs          # Point d'entrée, configuration
│   ├── appsettings.json    # Configuration
│   └── docker-compose.yml  # Déploiement PostgreSQL + API
├── Business Layer/         # Logique métier (Active Record)
├── Data Access/            # Accès BD via procédures stockées PostgreSQL
└── DTO/                    # Data Transfer Objects
```

### Dépendances entre couches

```
Presentation → Business Layer + DTO
Business Layer → Data Access + DTO
Data Access → DTO
DTO (standalone)
```

## Prérequis

- [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [PostgreSQL 15](https://www.postgresql.org/download/) (local ou Docker)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optionnel)

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd Backend/Presentation
```

### 2. Base de données

**Option A — Docker (recommandé) :**

```bash
docker-compose up -d
```

**Option B — PostgreSQL local :**

Créez une base nommée `order_management_archive` et exécutez les scripts de création des tables et procédures stockées (voir `Data Access/`).

### 3. Configuration

La chaîne de connexion est définie dans `Data Access/clsSeting.cs` :

```csharp
Host=localhost;Port=5432;Database=order_management_archive;Username=postgres;Password=1234
```

En Docker, elle est surchargée via la variable d'environnement `ConnectionString`.

### 4. Lancer l'API

```bash
cd Presentation
dotnet run
```

L'API démarre sur `http://localhost:5151` — Swagger accessible sur `/swagger`.

## Déploiement Docker

```bash
cd Presentation
docker-compose up --build -d
```

Services :
- **API** : `http://localhost:5000`
- **PostgreSQL** : `localhost:5432`

## API — Aperçu des endpoints

| Méthode | Route | Rôle | Description |
|---|---|---|---|
| POST | `/api/Auth/login` | — | Authentification |
| GET | `/api/Courriers` | Admin | Tous les courriers |
| POST | `/api/Courriers` | Agent, SuperAgent | Créer un courrier |
| PUT | `/api/Courriers/{id}/status` | Agent, SuperAgent | Changer le statut |
| PUT | `/api/Courriers/{id}/reassign` | Admin, SuperAgent | Réaffecter un courrier |
| GET | `/api/Courriers/search` | Tous | Recherche full-text |
| GET | `/api/agent/dashboard` | Agent, SuperAgent | Tableau de bord Agent |
| GET | `/api/LecteurDashboard` | Lecteur, SuperAgent | Tableau de bord Lecteur |
| GET | `/api/Notifications` | Tous | Mes notifications |
| GET | `/api/Users` | Admin | Gérer les utilisateurs |

Documentation complète : Swagger UI (`/swagger`).

## Pipeline OCR

1. **Scan** : Capture/import d'image → `ScanDocument`
2. **Extraction** : Tesseract OCR avec modèles `fra`, `eng`, `ara` — DPI 300
3. **Classification** : Correspondance de mots-clés → 8 catégories (RH, Financier, Juridique, Technique, Administratif, Archive, Externe, Interne)
4. **Validation** : L'Agent/SuperAgent peut corriger le texte et valider/reclasser

## Hiérarchie des rôles

```
Administrateur (tous droits)
    ↑
Super Agent (Agent + réaffectation, consultation par catégorie, dashboard Lecteur)
    ↑
Agent (courriers, OCR, scan, statuts)
    ↑
Lecteur (consultation, recherche, notifications)
```

## Architecture

- **Active Record** : Les classes métier (`Courrier`, `User`, `Notification`) encapsulent données et comportement (`Save()`)
- **Procédures stockées** : Toute la persistance passe par des fonctions PostgreSQL (ex. `sp_add_user`, `fn_courrier_update_statut_with_history`)
- **Mapping manuel** : `CourrierMapper` convertit entre DTOs et entités
- **Configuration statique** : Chaîne de connexion et clé JWT codées en dur (à migrer vers des variables d'environnement pour la production)
