# bureau-ordre-archives-mobile
Mobile app for managing bureau d'ordre and archives with AI features





# Département : Mathématiques et Informatique

**Licence en Génie Informatique**

**Module M365 : Projet d'étude et réalisation**

---

# RAPPORT DU PROJET

---

## SYSTÈME DE GESTION INTELLIGENTE DU BUREAU D'ORDRE

---

**Présenté par**

……………………………………………………………………

---

Soutenue le ………………………… à …………

**Devant le jury :**

| | |
|---|---|
| Pr …………………… — Professeur à la Faculté Polydisciplinaire de Taroudant | Président |
| Pr …………………… — Professeur à la Faculté Polydisciplinaire de Taroudant | Examinateur |
| Pr …………………… — Professeur à la Faculté Polydisciplinaire de Taroudant | Encadrant |

---

**Année Universitaire 2025–2026**

---

## REMERCIEMENTS

Nous tenons à exprimer notre profonde gratitude envers toutes les personnes qui ont contribué, de près ou de loin, à la réalisation de ce projet.

Nous remercions en premier lieu notre encadrant, dont les conseils avisés, la disponibilité constante et la rigueur scientifique ont guidé chacune des étapes de ce travail. Sa bienveillance et son engagement pédagogique ont été une source d'inspiration tout au long de cette expérience.

Nos remerciements vont également à l'ensemble du corps enseignant du Département de Mathématiques et Informatique de la Faculté Polydisciplinaire de Taroudant, pour la qualité de la formation dispensée et pour nous avoir fourni les outils théoriques et pratiques nécessaires à la conduite de ce projet.

Nous remercions aussi les membres du jury qui ont bien voulu consacrer de leur temps précieux à l'évaluation de ce travail.

Enfin, nous exprimons notre reconnaissance à nos familles et à nos proches, dont le soutien moral indéfectible a été un pilier essentiel tout au long de ce parcours académique.

---

## RÉSUMÉ

Dans un contexte organisationnel où la volumétrie des correspondances ne cesse de croître, la gestion manuelle du courrier entrant et sortant représente une source significative d'inefficacité, d'erreurs et de délais. Ce projet propose une solution numérique complète intitulée **Bureau d'Ordre Intelligent**, conçue pour automatiser et centraliser la gestion du courrier au sein d'une organisation.

L'application repose sur une architecture client-serveur : un frontend mobile Android développé avec React Native et Expo, et un backend REST développé en ASP.NET Core (.NET 10) communiquant avec une base de données PostgreSQL. Le système intègre un moteur de reconnaissance optique de caractères (OCR) basé sur Tesseract, prenant en charge le français, l'anglais et l'arabe, ainsi qu'un module de classification automatique des courriers par règles métier. La gestion des accès est assurée par une authentification JWT et un système de rôles différenciés (Administrateur, Agent, SuperAgent, Lecteur).

La conception du système s'appuie sur un ensemble complet de diagrammes UML : diagramme de cas d'utilisation, diagramme de classes, diagrammes de séquence pour chaque fonctionnalité majeure, et diagramme d'architecture système.

**Mots-clés :** Bureau d'ordre, gestion du courrier, OCR, classification automatique, ASP.NET Core, React Native, PostgreSQL, JWT, architecture client-serveur.

---

## INTRODUCTION GÉNÉRALE

La transformation numérique des administrations et des organisations constitue aujourd'hui un impératif stratégique. Au cœur de cette transformation se trouve la dématérialisation des processus documentaires, en particulier la gestion des correspondances officielles. Le bureau d'ordre, pivot central du circuit du courrier dans toute structure organisée, reste encore aujourd'hui un service largement dépendant de pratiques manuelles : enregistrement sur registre papier, classement physique des documents, suivi informel des traitements et diffusion non systématisée des notifications.

Ces pratiques engendrent des problèmes récurrents : perte de documents, absence de traçabilité, difficultés de recherche, délais de traitement non maîtrisés et impossibilité d'établir des statistiques fiables sur le flux du courrier. Face à ces enjeux, il devient indispensable de concevoir et de déployer une solution informatique adaptée, capable de prendre en charge l'ensemble du cycle de vie du courrier, depuis sa réception ou sa création jusqu'à son archivage.

C'est dans ce contexte que s'inscrit le présent projet de fin d'études, qui a pour objet la conception et le développement d'un système de gestion intelligente du bureau d'ordre. L'application développée, nommée **Bureau d'Ordre Intelligent**, offre une gestion complète des courriers entrants et sortants, un accès mobile, une extraction automatique du texte par OCR, une classification automatique par catégorie, une gestion des rôles et des accès, ainsi qu'un système de notifications en temps réel.

Ce rapport est structuré en deux chapitres principaux. Le **premier chapitre** expose l'analyse et la conception du système : étude de l'existant, identification des besoins fonctionnels et non fonctionnels, modélisation UML et architecture générale. Le **second chapitre** décrit la réalisation technique du système : choix technologiques, structure du code, détail de chaque module développé et présentation des interfaces de l'application.

---

## TABLE DES MATIÈRES

- [REMERCIEMENTS](#remerciements)
- [RÉSUMÉ](#résumé)
- [INTRODUCTION GÉNÉRALE](#introduction-générale)
- [LISTE DES ABRÉVIATIONS](#liste-des-abréviations)
- [LISTE DES FIGURES](#liste-des-figures)
- [LISTE DES TABLEAUX](#liste-des-tableaux)
- [CHAPITRE 1 : ANALYSE ET CONCEPTION DU SYSTÈME](#chapitre-1--analyse-et-conception-du-système)
  - [I. Introduction](#i-introduction)
  - [II. Étude de l'existant et analyse des besoins](#ii-étude-de-lexistant-et-analyse-des-besoins)
    - [II.1 Étude de l'existant](#ii1-étude-de-lexistant)
    - [II.1.2 Problèmes identifiés](#ii12-problèmes-identifiés)
    - [II.1.3 Solution proposée](#ii13-solution-proposée)
    - [II.2 Analyse des besoins](#ii2-analyse-des-besoins)
    - [II.2.1 Besoins fonctionnels](#ii21-besoins-fonctionnels)
    - [II.3 Besoins non fonctionnels](#ii3-besoins-non-fonctionnels)
  - [III. Conception du système](#iii-conception-du-système)
    - [III.1 Diagramme de cas d'utilisation](#iii1-diagramme-de-cas-dutilisation)
    - [III.1.1 Acteurs et rôles](#iii11-acteurs-et-rôles)
  - [IV. Conclusion](#iv-conclusion-1)
- [CHAPITRE 2 : RÉALISATION TECHNIQUE](#chapitre-2--réalisation-technique)
  - [I. Introduction](#i-introduction-1)
  - [II. Environnement et outils de développement](#ii-environnement-et-outils-de-développement)
    - [II.1 Technologies Backend](#ii1-technologies-backend)
    - [II.1.2 Technologies Frontend](#ii12-technologies-frontend)
    - [II.1.3 Base de données et déploiement](#ii13-base-de-données-et-déploiement)
    - [II.2 Architecture technique détaillée](#ii2-architecture-technique-détaillée)
    - [II.2.1 Structure du backend](#ii21-structure-du-backend)
    - [II.3 Modules fonctionnels réalisés](#ii3-modules-fonctionnels-réalisés)
  - [III. Présentation des fonctionnalités principales](#iii-présentation-des-fonctionnalités-principales)
    - [III.1 Module d'authentification](#iii1-module-dauthentification)
    - [III.1.1 Fonctionnement du système JWT](#iii11-fonctionnement-du-système-jwt)
  - [IV. Conclusion](#iv-conclusion-2)
- [CONCLUSION GÉNÉRALE ET PERSPECTIVES](#conclusion-générale-et-perspectives)
- [BIBLIOGRAPHIE](#bibliographie)
- [ANNEXE A — Modèle de la base de données (ERD)](#annexe-a--modèle-de-la-base-de-données-erd)
- [ANNEXE B — Diagramme de classes complet](#annexe-b--diagramme-de-classes-complet)

---

## LISTE DES ABRÉVIATIONS

| Abréviation | Signification |
|---|---|
| API | Application Programming Interface |
| ASP | Active Server Pages |
| BCrypt | Algorithme de hachage de mots de passe |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| ERD | Entity-Relationship Diagram |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MVC | Model-View-Controller |
| OCR | Optical Character Recognition (Reconnaissance Optique de Caractères) |
| ORM | Object-Relational Mapping |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| SQL | Structured Query Language |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |
| UUID | Universally Unique Identifier |

---

## LISTE DES FIGURES

- **Figure 1** — Diagramme d'architecture système du Bureau d'Ordre Intelligent
- **Figure 2** — Diagramme de cas d'utilisation global
- **Figure 3** — Diagramme de cas d'utilisation — S'authentifier
- **Figure 4** — Diagramme de classes UML
- **Figure 5** — Diagramme de séquence — Connexion utilisateur
- **Figure 6** — Diagramme de séquence — Création d'un courrier entrant
- **Figure 7** — Diagramme de séquence — Scan et extraction OCR
- **Figure 8** — Diagramme de séquence — Mise à jour du statut d'un courrier
- **Figure 9** — Structure en couches du backend ASP.NET Core

---

## LISTE DES TABLEAUX

- **Tableau 1** — Comparaison des rôles utilisateurs et de leurs permissions
- **Tableau 2** — Description des entités principales de la base de données
- **Tableau 3** — Récapitulatif des endpoints REST de l'API
- **Tableau 4** — Catégories de classification automatique et mots-clés associés

---

## CHAPITRE 1 : ANALYSE ET CONCEPTION DU SYSTÈME

### I. Introduction

Ce premier chapitre pose les bases analytiques et conceptuelles du projet. Il s'articule autour de trois axes principaux : l'étude de l'existant et l'identification des dysfonctionnements qui motivent le développement de la solution, l'analyse des besoins fonctionnels et non fonctionnels du système cible, et enfin la modélisation conceptuelle du système à travers les outils de l'UML (Unified Modeling Language) et la définition de son architecture générale.

La démarche adoptée suit le cycle classique de l'ingénierie logicielle : comprendre le problème avant de concevoir la solution, modéliser avant de coder, et valider la cohérence conceptuelle avant d'entreprendre la réalisation. Cette rigueur méthodologique est essentielle pour garantir la maintenabilité, l'évolutivité et la qualité globale du système livré.

### II. Étude de l'existant et analyse des besoins

#### II.1 Étude de l'existant

Dans la plupart des organismes publics et privés, la gestion du courrier repose encore sur des procédures manuelles ou semi-manuelles. Le courrier entrant est physiquement réceptionné, tamponné, enregistré à la main dans un registre papier ou, au mieux, dans un tableur, puis acheminé manuellement vers les services concernés. Le courrier sortant suit le chemin inverse : rédigé par les services, visé hiérarchiquement, enregistré puis expédié.

Ce mode de fonctionnement présente plusieurs caractéristiques structurantes : l'absence de numérisation systématique des documents, la dépendance à la présence physique des agents pour le traitement, l'impossibilité d'effectuer des recherches rapides sur le fond documentaire, et le manque total de mécanismes automatiques de notification ou d'alerte.

#### II.1.2 Problèmes identifiés

L'analyse de l'existant permet de mettre en évidence les problèmes suivants :

- **Perte et détérioration des documents** : les courriers papier sont susceptibles d'être égarés, endommagés ou détruits, rendant toute reconstitution ultérieure impossible.
- **Absence de traçabilité** : il est difficile de savoir, à un instant donné, où se trouve un courrier, qui en est responsable et quel est son état de traitement.
- **Difficultés de recherche** : la recherche d'un courrier antérieur nécessite de consulter physiquement les registres ou de recourir à la mémoire des agents.
- **Délais de traitement non maîtrisés** : sans système d'alerte ou de suivi automatisé, les courriers urgents peuvent rester en attente sans que personne ne soit notifié.
- **Impossibilité de produire des statistiques** : sans base de données structurée, il est impossible de générer des tableaux de bord sur le volume, la nature ou le délai de traitement des courriers.
- **Accès limité à distance** : les agents ne peuvent pas accéder au système en dehors des locaux de l'organisme.

#### II.1.3 Solution proposée

Face à ces limitations, nous proposons de développer une application mobile et serveur complète qui couvre l'intégralité du cycle de vie du courrier : réception/création, numérisation, extraction OCR, classification automatique, assignation, suivi de statut, notification, recherche et archivage. La solution repose sur une architecture moderne, modulaire et sécurisée, accessible depuis n'importe quel appareil Android disposant d'une connexion réseau.

#### II.2 Analyse des besoins

#### II.2.1 Besoins fonctionnels

Le système doit offrir les fonctionnalités suivantes, regroupées par domaine :

**Authentification et gestion des utilisateurs :**
- Authentification sécurisée par identifiant (email) et mot de passe
- Gestion des sessions via token JWT avec expiration
- Gestion complète des comptes utilisateurs (création, modification, désactivation, suppression) par l'Administrateur
- Attribution de rôles différenciés : Admin, Agent, SuperAgent, Lecteur
- Changement de mot de passe par l'utilisateur lui-même

**Gestion des courriers entrants :**
- Création d'un courrier entrant avec saisie des métadonnées (référence, objet, expéditeur, date de réception, catégorie, agent assigné, date d'échéance)
- Génération automatique d'une référence unique
- Attachement de pièces jointes (images, PDF) avec validation du type MIME
- Numérisation de documents via la caméra du terminal mobile
- Extraction automatique du texte par OCR (Tesseract, langues : français, anglais, arabe)
- Correction manuelle du texte OCR par l'agent
- Classification automatique par catégorie basée sur les mots-clés du texte OCR
- Validation ou correction manuelle de la catégorie proposée
- Suivi du statut (À traiter → En traitement → Traité → Archivé)
- Historique complet des changements de statut avec horodatage et auteur

**Gestion des courriers sortants :**
- Création d'un courrier sortant avec saisie des métadonnées (référence, objet, destinataire, date d'envoi)
- Gestion du cycle de statut spécifique (Brouillon → Prêt → Envoyé → Archivé)
- Attachement de pièces jointes

**Recherche et consultation :**
- Recherche multi-critères (référence, objet, statut, catégorie, expéditeur, destinataire)
- Consultation du détail d'un courrier avec ses pièces jointes et son historique
- Accès filtré par catégorie pour les rôles Lecteur et SuperAgent

**Notifications :**
- Notification automatique lors de l'assignation d'un courrier
- Notification automatique lors d'un changement de statut
- Notification spécifique aux Lecteurs et SuperAgents pour les courriers de leur catégorie
- Marquage individuel ou global des notifications comme lues
- Compteur de notifications non lues

**Tableaux de bord :**
- Dashboard Administrateur : statistiques globales (nombre d'utilisateurs, d'agents, de lecteurs, courriers entrants/sortants/en attente/archivés), activités récentes
- Dashboard Agent/SuperAgent : statistiques personnalisées (courriers assignés, en attente, brouillons, scans récents), liste des courriers assignés, activités récentes, résultats OCR récents
- Dashboard Lecteur/SuperAgent : statistiques de la catégorie assignée (entrants, sortants, archivés, semaine courante), documents récents, mises à jour récentes

**Rapports :**
- Génération de rapports synthétiques pour l'Administrateur
- Filtrage par période (7 jours, 30 jours, 3 mois, 6 mois, 1 an)
- Répartition mensuelle des courriers entrants/sortants
- Distribution par catégorie avec pourcentage
- Activité utilisateur par jour de la semaine
- Indicateurs clés : taux de traitement, délai moyen, courriers en retard, taux d'archivage

#### II.3 Besoins non fonctionnels

Le système doit également satisfaire les contraintes non fonctionnelles suivantes :

- **Sécurité** : authentification par JWT avec hachage BCrypt des mots de passe, politiques d'autorisation granulaires (propriétaire du courrier ou Admin), protection CORS configurée, validation des types MIME pour les uploads.
- **Performance** : requêtes SQL optimisées via procédures stockées PostgreSQL, pagination implicite dans les requêtes de liste, limitation du nombre de résultats renvoyés dans les dashboards.
- **Maintenabilité** : architecture 3-couches stricte (Présentation / Métier / Accès aux données), séparation des responsabilités par contrôleur, utilisation systématique des DTOs pour le transport des données.
- **Portabilité** : application mobile compilée pour Android (et compatible iOS) avec Expo, backend dockerisé pour un déploiement uniforme.
- **Extensibilité** : services OCR et classification injectés par interface (`IOcrService`, `IOcrClassificationService`), permettant de substituer Tesseract par un service cloud ou un modèle ML sans modifier le reste de l'application.
- **Disponibilité** : déploiement via Docker Compose avec volumes persistants pour la base de données PostgreSQL.

### III. Conception du système

#### III.1 Diagramme de cas d'utilisation

Le diagramme de cas d'utilisation offre une vue externe du système, centrée sur les interactions entre les acteurs humains et les fonctionnalités offertes. Il permet de délimiter le périmètre du système et de préciser les droits d'accès de chaque rôle.

#### III.1.1 Acteurs et rôles

Le système définit trois acteurs principaux organisés selon une hiérarchie d'héritage, à laquelle s'ajoute un quatrième rôle technique :

**Tableau 1 — Comparaison des rôles utilisateurs et de leurs permissions**

| Fonctionnalité | Lecteur | Agent | SuperAgent | Administrateur |
|---|---|---|---|---|
| S'authentifier | ✓ | ✓ | ✓ | ✓ |
| Consulter les courriers (catégorie) | ✓ | ✓ | ✓ | ✓ |
| Rechercher / Filtrer | ✓ | ✓ | ✓ | ✓ |
| Suivre le statut & historique | ✓ | ✓ | ✓ | ✓ |
| Recevoir des notifications | ✓ | ✓ | ✓ | ✓ |
| Créer un courrier entrant | ✗ | ✓ | ✓ | ✓ |
| Créer un courrier sortant | ✗ | ✓ | ✓ | ✓ |
| Scanner un document / OCR | ✗ | ✓ | ✓ | ✓ |
| Mettre à jour le statut | ✗ | ✓ | ✓ | ✓ |
| Réassigner un courrier | ✗ | ✓ (limité) | ✓ (catégorie) | ✓ |
| Gérer les utilisateurs et rôles | ✗ | ✗ | ✗ | ✓ |
| Accéder aux rapports | ✗ | ✗ | ✗ | ✓ |
| Dashboard admin global | ✗ | ✗ | ✗ | ✓ |

Les cas d'utilisation sont regroupés en cinq packages :
- **Authentification & Utilisateurs** : S'authentifier, Gérer les utilisateurs et rôles
- **Gestion des courriers entrants** : Gérer les courriers entrants (avec inclusion de Scanner un document, Effectuer l'OCR, Classer par règles, Ajouter pièces jointes, et extension vers Générer accusé de réception)
- **Gestion des courriers sortants** : Gérer les courriers sortants, Mettre à jour le statut
- **Recherche & Consultation** : Rechercher/Filtrer, Suivre le statut & Historique
- **Notifications** : Recevoir des notifications

Les relations structurelles du diagramme sont les suivantes :
- `<<include>>` entre les cas d'utilisation de gestion des courriers et `S'authentifier` (prérequis obligatoire)
- `<<include>>` entre `Gérer les courriers entrants` et `Scanner un document`, entre `Scanner un document` et `Effectuer l'OCR`
- `<<extend>>` de `Recevoir des notifications` vers `Mettre à jour le statut` et `Gérer les courriers entrants` (déclenchement conditionnel)

*(Figure 1 — Diagramme de cas d'utilisation global)*

*(Figure 3 — Diagramme de cas d'utilisation — S'authentifier)*

### III.2 Diagramme de classes

Le diagramme de classes représente la structure statique du système, c'est-à-dire l'ensemble des entités du domaine métier, leurs attributs, leurs méthodes et leurs relations.

Le modèle de classes s'organise autour des regroupements suivants :

**Hiérarchie des utilisateurs :**
- La classe abstraite `Utilisateur` centralise les attributs communs (id, username, nom, prénom, email, motDePasseHash, actif, dateCreation, dateModification) et les opérations de session (seConnecter, seDeconnecter).
- `Admin` hérite de `Utilisateur` et ajoute les opérations de gestion du système (creerUtilisateur, modifierUtilisateur, supprimerUtilisateur, gererParametres).
- `Agent` hérite de `Utilisateur` et dispose des opérations de gestion du courrier (creerCourrier, modifierCourrier, changerStatut, corrigerOCR, corrigerClassification).
- `Lecteur` hérite de `Utilisateur` et est limité aux opérations de consultation (consulterCourrier, rechercherCourrier).
- `SessionUtilisateur` est liée à `Utilisateur` par une composition (1 à 0..*) avec les attributs token, dateDebut, dateExpiration et l'état de session (ACTIVE, EXPIREE, FERMEE).

**Hiérarchie des courriers :**
- La classe abstraite `Courrier` centralise les attributs communs (id, reference, objet, description, statut, texteOcrIndexe, categorieValidee, dateCreation, dateModification) et les opérations de cycle de vie (creer, modifier, archiver, rechercher).
- `CourrierEntrant` spécialise `Courrier` avec les attributs dateReception et expediteur.
- `CourrierSortant` spécialise `Courrier` avec les attributs dateEnvoi et destinataire.

**Documents et OCR :**
- `PieceJointe` est liée à `Courrier` par une composition (1 à 0..*).
- `ScanDocument` est liée à `PieceJointe` par une composition (1 à 0..1) avec les opérations capturer, recadrer, exporterPDF, exporterImage.
- `OCRResultat` est liée à `ScanDocument` par une composition (1 à 0..1) avec les attributs texteExtrait, texteCorrige, confiance, corrigeManuellement, et les opérations extraireTexte, corrigerTexte.

**Classification :**
- `ClassificationCourrier` est liée à `Courrier` par une agrégation (1 à 0..1) avec les attributs categorieProposee, scoreConfiance, methode, validee, corrigeeManuellement.

**Notifications et traçabilité :**
- `Notification` est reliée à `Utilisateur` (récepteur) et à `Courrier` (déclencheur).
- `HistoriqueStatut` est liée à `Courrier` par une composition (1 à 0..*) et à `Utilisateur` (auteur de la modification).

**Énumérations :**
- `TypeCourrier` : ENTRANT, SORTANT
- `StatutCourrierEntrant` : A_TRAITER, EN_TRAITEMENT, TRAITE, ARCHIVE
- `StatutCourrierSortant` : BROUILLON, PRET, ENVOYE, ARCHIVE
- `TypePieceJointe` : IMAGE, PDF, SCAN
- `CanalNotification` : IN_APP, PUSH
- `EtatSession` : ACTIVE, EXPIREE, FERMEE

*(Figure 4 — Diagramme de classes UML)*

### III.3 Diagrammes de séquence

Les diagrammes de séquence décrivent les interactions temporelles entre les objets pour la réalisation de chaque cas d'utilisation majeur. Neuf diagrammes ont été produits.

**Connexion utilisateur :** L'utilisateur saisit ses identifiants. L'interface transmet la requête à l'`AuthService`. Celui-ci vérifie les credentials contre la base. En cas de succès, il crée une session (génération du token JWT), retourne le token et le rôle à l'interface, et accorde l'accès. En cas d'échec, une erreur est renvoyée.

*(Figure 5 — Diagramme de séquence — Connexion utilisateur)*

**Création d'un courrier entrant :** L'agent remplit le formulaire. L'interface appelle `Courrier.creer()`. L'objet est initialisé (id, référence, date, statut = A_TRAITER). La classification est immédiatement déclenchée sur le texte OCR disponible. L'historique de statut est enregistré. Une confirmation est renvoyée à l'agent.

*(Figure 6 — Diagramme de séquence — Création d'un courrier entrant)*

**Scan et extraction OCR :** L'agent importe une image. L'interface appelle `ScanDocument.capturer()`. Une prévisualisation est affichée. Après validation, le scan est exporté, sauvegardé comme `PieceJointe`, et l'OCR est lancé. Le résultat (texte + score de confiance) est affiché. L'agent peut corriger le texte, ce qui déclenche une reclassification automatique.

*(Figure 7 — Diagramme de séquence — Scan et extraction OCR)*

**Mise à jour du statut :** L'agent sélectionne un nouveau statut. Le système vérifie la validité de la transition. Si elle est valide, le statut est mis à jour, l'historique est enregistré, et une notification est envoyée à l'agent assigné. Si la transition est invalide, une erreur est retournée.

*(Figure 8 — Diagramme de séquence — Mise à jour du statut)*

### III.4 Modèle entité-relation (ERD)

La base de données relationnelle du système est structurée autour des entités suivantes :

**Tableau 2 — Description des entités principales de la base de données**

| Entité | Clé primaire | Attributs principaux | Relations |
|---|---|---|---|
| `ROLE` | id (int) | nom, description | 1–N avec USER |
| `USER` | id (int) | username, firstname, lastname, email, mot_de_passe_hash, role_id (FK), isActif, created_at, updated_at, image_path | N–1 avec ROLE ; N–M avec CATEGORIE via user_categorie_access |
| `CATEGORIE` | id (int) | nom, description | 1–N avec COURRIER ; N–M avec USER |
| `COURRIER` | id (int) | reference, type, date_courrier, expediteur, destinataire, objet, description, statut, texte_ocr, categorie_id (FK), auteur_id (FK), assigne_a (FK), created_at, updated_at, date_echeance | N–1 avec CATEGORIE et USER |
| `PIECE_JOINTE` | id (int) | courrier_id (FK), nom_fichier, type_fichier, chemin_fichier, format, taille, est_scan, created_at | N–1 avec COURRIER |
| `OCR_RESULTAT` | id (int) | piece_jointe_id (FK), texte_extrait, confiance, created_at | N–1 avec PIECE_JOINTE |
| `CLASSIFICATION_COURRIER` | id (int) | courrier_id (FK), categorie_id (FK), score_confiance, methode, validee, corrigee_manuellement | N–1 avec COURRIER et CATEGORIE |
| `HISTORIQUE_STATUT` | id (int) | courrier_id (FK), ancien_statut, nouveau_statut, modifie_par (FK), commentaire, changed_at | N–1 avec COURRIER et USER |
| `NOTIFICATIONS` | id (int) | user_id (FK), title, message, type, entity_type, entity_id, is_read, created_by, created_at, read_at | N–1 avec USER |
| `user_categorie_access` | (user_id, categorie_id) | — | Table de jonction USER ↔ CATEGORIE |

### III.5 Architecture système

L'architecture globale du système est de type **client-serveur en couches**. Elle se décompose comme suit (Figure 1) :

**Côté client (Application Mobile Android) :**
- Interface Utilisateur (UI) — composants React Native
- Logique de présentation (ViewModel / Controller) — gestion de l'état et des interactions
- Module Caméra / Scan — capture documentaire
- Module OCR local (optionnel) — traitement hors ligne
- Module Classification locale (optionnel) — catégorisation hors ligne
- Gestion de session locale — stockage du token JWT
- Base locale Room / SQLite (optionnelle) — cache et mode hors ligne

**Côté serveur (Backend REST ASP.NET Core) :**
- API REST — point d'entrée unique pour toutes les requêtes HTTP/JSON
- Service Authentification — validation JWT, gestion des tokens
- Service Gestion Courriers — logique métier courrier
- Service OCR — Tesseract (fra+eng+ara)
- Service Classification — moteur de règles par mots-clés
- Service Notifications — création et distribution des alertes
- Service Fichiers / Upload — gestion du stockage des pièces jointes

**Couche de persistance :** Base de données PostgreSQL 15, accédée via Npgsql avec procédures stockées.

*(Figure 1 — Diagramme d'architecture système)*
*(Figure 9 — Structure en couches du backend ASP.NET Core)*

### IV. Conclusion {#iv-conclusion-1}

Ce premier chapitre a permis de fonder solidement le projet sur une analyse rigoureuse de l'existant et une modélisation complète des besoins et de la structure du système. Les diagrammes UML produits — cas d'utilisation, classes, séquences — constituent une feuille de route précise pour la phase de réalisation. L'architecture retenue, basée sur une séparation stricte des couches et une injection de dépendances pour les services techniques (OCR, classification), garantit la modularité et l'évolutivité de la solution.

---

## CHAPITRE 2 : RÉALISATION TECHNIQUE

### I. Introduction {#i-introduction-1}

Ce second chapitre détaille la mise en œuvre concrète du système Bureau d'Ordre Intelligent. Il présente les choix technologiques retenus, la structure du code source organisé en trois couches, et décrit en profondeur chacun des modules développés : authentification, gestion des courriers, OCR et classification automatique, gestion des pièces jointes, notifications, tableaux de bord, et rapports. Une attention particulière est portée aux décisions d'implémentation qui garantissent la sécurité, la performance et la maintenabilité de l'application.

### II. Environnement et outils de développement

#### II.1 Technologies Backend

Le backend est développé en **C# avec ASP.NET Core (.NET 10)**, le framework web moderne de Microsoft, réputé pour ses performances élevées, sa modularité et son écosystème mature. Le choix de .NET 10 garantit l'accès aux dernières optimisations du runtime et aux fonctionnalités linguistiques les plus récentes.

La couche d'accès aux données utilise **Npgsql**, le connecteur PostgreSQL natif pour .NET, sans couche ORM intermédiaire. Ce choix délibéré permet un contrôle total des requêtes SQL et l'utilisation de procédures stockées PostgreSQL pour les opérations critiques, ce qui améliore les performances et centralise la logique de base de données.

La sécurité repose sur :
- **JWT (JSON Web Token)** pour l'authentification stateless avec l'algorithme HMAC-SHA256 et une durée de validité de 30 minutes.
- **BCrypt.Net** pour le hachage des mots de passe, avec salage automatique, rendant les attaques par dictionnaire et par force brute prohibitivement coûteuses.

Le service OCR s'appuie sur **Tesseract** via le package NuGet `Tesseract`, avec des données d'entraînement pour le français (`fra.traineddata`), l'anglais (`eng.traineddata`) et l'arabe (`ara.traineddata`). La classification automatique est implémentée comme un service de règles basé sur des dictionnaires de mots-clés, facilement extensible.

La documentation de l'API est assurée par **Swagger/OpenAPI** avec configuration d'authentification Bearer pour les tests interactifs.

#### II.1.2 Technologies Frontend

Le frontend est développé avec **React Native** et **Expo** (SDK récent, `newArchEnabled: true`), permettant de cibler Android et iOS à partir d'une base de code unique en TypeScript. La navigation est gérée par **expo-router** qui adopte le paradigme de routage basé sur le système de fichiers (file-based routing), similaire à Next.js.

L'application adopte une architecture modulaire organisée par domaines fonctionnels (`src/modules/`), avec une séparation entre la couche domaine (use cases), la couche données (repositories), et la couche présentation (screens, hooks). Le thème visuel est géré via un `ThemeProvider` centralisé.

#### II.1.3 Base de données et déploiement

La base de données choisie est **PostgreSQL 15**, un système de gestion de base de données relationnelle open-source robuste, reconnu pour sa conformité aux standards SQL, ses performances sur les requêtes complexes et son support natif des types de données avancés.

Le déploiement de l'ensemble du système est orchestré via **Docker Compose**, avec deux services définis : le service `postgres` (image officielle `postgres:15-alpine` avec volume persistant pour les données) et le service `api` (image construite à partir du `Dockerfile` ASP.NET Core). Le backend est exposé sur le port 5000 et dépend du démarrage du service PostgreSQL.

Le `Dockerfile` du backend utilise un build multi-étapes : compilation avec l'image SDK .NET 10, puis déploiement de l'artéfact compilé sur l'image runtime ASP.NET Core légère.

#### II.2 Architecture technique détaillée

#### II.2.1 Structure du backend

Le backend est organisé en quatre projets distincts dans la solution Visual Studio :

**1. Presentation (backend.csproj)** — Le projet principal. Contient :
- `Program.cs` : configuration du pipeline ASP.NET Core (JWT, CORS, Swagger, injection de dépendances)
- `Controllers/` : 10 contrôleurs REST
- `Authorization/` : gestionnaires de politiques d'autorisation personnalisées
- `Services/Ocr/` : interface `IOcrService` et implémentation `TesseractOcrService`
- `Services/Classification/` : interface `IOcrClassificationService` et implémentation `RuleBasedOcrClassificationService`
- `Mappings/CourrierMapper.cs` : conversion entre DTOs de création/mise à jour et DTOs de domaine
- `uploads/` : stockage des pièces jointes organisées par courrier

**2. Business Layer (BusinessLayer.csproj)** — La couche métier. Contient les classes de domaine : `User`, `Courrier`, `Notification`, `Categorie`, `PieceJointe`, `HistoriqueStatut`, `Dashboard`, `AgentDashboard`, `LecteurDashboard`, `Reports`. Chaque classe encapsule la logique métier et délègue la persistance à la couche Data Access.

**3. Data Access (Data Access.csproj)** — La couche d'accès aux données. Contient les classes `*Data` qui exécutent les requêtes SQL via Npgsql. La chaîne de connexion est centralisée dans `clsSeting.cs`.

**4. DTO (DTO.csproj)** — Les objets de transfert de données. Organisés par domaine : `Courriers/`, `Users/`, `Notifications/`, `Categories/`, `PiecesJointes/`, `Historiques/`, `Dashboard/`, `AgentDashboard/`, `LecteurDashboard/`, `Reports/`.

*(Figure 9 — Structure en couches du backend ASP.NET Core)*

#### II.2.2 Configuration du pipeline ASP.NET Core

Le fichier `Program.cs` configure l'ensemble du pipeline middleware dans l'ordre suivant :

1. Ajout des contrôleurs et de l'explorateur d'endpoints
2. Configuration Swagger avec schéma de sécurité Bearer JWT
3. Configuration CORS (`BureauDorderApiCorsPolicy`) autorisant les origines du frontend Expo (ports 8081, 8082, 8083) et les origines locales de développement
4. Configuration JWT Bearer : validation de l'émetteur (`BureauOrderArchiveAPI`), de l'audience (`BureauOrderArchiveAPIUsers`), de la durée de vie, et de la clé de signature HMAC-SHA256
5. Enregistrement des politiques d'autorisation personnalisées (`UserOwnerOrAdmin`, `CourrierOwnerOrAdmin`) et de leurs gestionnaires (`IAuthorizationHandler`)
6. Injection des services OCR et classification en mode `Scoped`
7. Activation du pipeline : HTTPS redirect (hors développement), CORS, authentification, autorisation, mapping des routes

#### II.3 Modules fonctionnels réalisés

**Tableau 3 — Récapitulatif des endpoints REST de l'API**

| Contrôleur | Endpoint | Méthode | Rôle requis | Description |
|---|---|---|---|---|
| AuthController | `/api/Auth/login` | POST | Aucun | Authentification, retourne JWT |
| UsersController | `/api/Users/All` | GET | Admin | Liste tous les utilisateurs |
| UsersController | `/api/Users/Active` | GET | Admin | Liste les utilisateurs actifs |
| UsersController | `/api/Users/{id}` | GET | Owner ou Admin | Récupère un utilisateur |
| UsersController | `/api/Users/Create` | POST | Admin | Crée un utilisateur |
| UsersController | `/api/Users/update/{id}` | PUT | Admin | Met à jour un utilisateur |
| UsersController | `/api/Users/deactivate/{id}` | PUT | Admin | Désactive un utilisateur |
| UsersController | `/api/Users/{id}` | DELETE | Admin | Supprime un utilisateur |
| UsersController | `/api/Users/chgPssw/{id}` | POST | Owner ou Admin | Change le mot de passe |
| CourrierAPIController | `/api/Courriers` | GET | Admin | Liste tous les courriers |
| CourrierAPIController | `/api/Courriers/{id}` | GET | Authentifié | Récupère un courrier |
| CourrierAPIController | `/api/Courriers/assigned/me` | GET | Authentifié | Courriers assignés à moi |
| CourrierAPIController | `/api/Courriers` | POST | Agent, SuperAgent | Crée un courrier |
| CourrierAPIController | `/api/Courriers/{id}` | PUT | Agent, SuperAgent | Met à jour un courrier |
| CourrierAPIController | `/api/Courriers/{id}/status` | PUT | Agent, SuperAgent | Met à jour le statut |
| PiecesJointesController | `/api/PiecesJointes/courrier/{id}` | GET | Admin, Agent, SuperAgent, Lecteur | Liste les pièces jointes |
| PiecesJointesController | `/api/PiecesJointes/courrier/{id}` | POST | Agent, SuperAgent | Upload une pièce jointe (+ OCR) |
| PiecesJointesController | `/api/PiecesJointes/{id}/download` | GET | Admin, Agent, SuperAgent, Lecteur | Télécharge une pièce jointe |
| CategoriesController | `/api/Categories` | GET | Authentifié | Liste les catégories |
| CategoriesController | `/api/Categories/{id}` | GET | Authentifié | Récupère une catégorie |
| NotificationsController | `/api/Notifications` | GET | Authentifié | Mes notifications |
| NotificationsController | `/api/Notifications/unread-count` | GET | Authentifié | Compteur non lus |
| NotificationsController | `/api/Notifications/{id}/read` | PUT | Authentifié | Marquer comme lu |
| NotificationsController | `/api/Notifications/read-all` | PUT | Authentifié | Tout marquer comme lu |
| NotificationsController | `/api/Notifications/{id}` | DELETE | Authentifié | Supprimer une notification |
| NotificationsController | `/api/Notifications/lecteur` | GET | Lecteur | Notifications par catégorie |
| NotificationsController | `/api/Notifications/SuperAgent` | GET | SuperAgent | Notifications par catégorie |
| DashboardController | `/api/dashboard/stats` | GET | Admin | Statistiques globales |
| DashboardController | `/api/dashboard/activity` | GET | Admin | Activités récentes |
| AgentDashboardController | `/api/agent/dashboard/overview` | GET | Agent, SuperAgent | Vue d'ensemble agent |
| AgentDashboardController | `/api/agent/dashboard/ocr-results` | GET | Agent, SuperAgent | Résultats OCR |
| LecteurDashboardController | `/api/LecteurDashboard/overview` | GET | Lecteur, SuperAgent | Vue d'ensemble lecteur |
| ReportsController | `/api/Reports/overview` | GET | Admin | Rapport de synthèse |

### III. Présentation des fonctionnalités principales

#### III.1 Module d'authentification

L'authentification est le point d'entrée de tous les autres modules. Elle est gérée par `AuthController` avec l'endpoint `POST /api/Auth/login`.

#### III.1.1 Fonctionnement du système JWT

Lorsqu'un utilisateur envoie ses identifiants (email + mot de passe), le système effectue les étapes suivantes :

1. **Recherche de l'utilisateur** par email dans la base de données (via `sp_get_user_by_email`)
2. **Vérification du mot de passe** en comparant le mot de passe fourni avec le hash BCrypt stocké
3. **Construction des claims JWT** : identifiant unique (`NameIdentifier`), nom complet (`Name`), email (`Email`), rôle (`Role`)
4. **Signature du token** avec la clé symétrique HMAC-SHA256 et une expiration de 30 minutes
5. **Retour de la réponse** contenant le token, les informations de base du profil utilisateur (id, email, nom complet, rôle)

Le client mobile conserve ce token et l'envoie dans le header `Authorization: Bearer {token}` de toutes les requêtes ultérieures. Le middleware JWT ASP.NET Core valide automatiquement ce token à chaque requête avant l'exécution du contrôleur.

**Politiques d'autorisation personnalisées :**
- `UserOwnerOrAdmin` : autorise uniquement si l'utilisateur est Admin ou si l'identifiant de l'utilisateur courant correspond à celui de la ressource demandée. Utilisé pour la consultation et la modification de profil.
- `CourrierOwnerOrAdmin` : autorise uniquement si l'utilisateur est Admin, ou si l'utilisateur est l'auteur du courrier, ou s'il est l'agent assigné au courrier. Le rôle SuperAgent et Lecteur bénéficient d'un accès élargi sur tous les courriers de leur catégorie.

#### III.2 Module de gestion des courriers

La gestion des courriers est le cœur fonctionnel du système. Elle est assurée par `CourrierAPIController` en collaboration avec la classe métier `Courrier` et la couche `CourrierData`.

**Création d'un courrier :** Le `CourrierMapper.ToCourrierDto()` transforme le DTO de création en DTO de domaine, en fixant automatiquement le statut initial (`ATraiter`) et les horodatages. La méthode `Courrier.Save()` détermine le mode (AddNew ou Update) et délègue à `CourrierData.AddCourrier()` qui appelle la procédure stockée `sp_add_courrier`. Après la création, si un agent est assigné, une notification est automatiquement créée.

**Mise à jour du statut avec historique :** L'endpoint `PUT /api/Courriers/{id}/status` appelle `Courrier.UpdateStatutWithHistory()`, qui exécute la fonction PostgreSQL `fn_courrier_update_statut_with_history`. Cette fonction atomique met à jour le statut du courrier et insère simultanément un enregistrement dans `historique_statut` avec l'ancien statut, le nouveau statut, l'auteur de la modification, et un commentaire optionnel. Une notification est ensuite envoyée à l'agent assigné et à l'auteur du courrier.

**Réassignation :** La méthode `CourrierData.ReassignCourrier()` exécute une transaction PostgreSQL qui vérifie que le nouvel agent est actif, effectue la mise à jour de `assigne_a`, et insère un historique de réassignation. Les conditions d'autorisation (Admin peut tout réassigner, SuperAgent peut réassigner dans sa catégorie, Agent peut réassigner uniquement ses propres courriers) sont vérifiées au niveau SQL.

#### III.3 Module OCR et classification automatique

Ce module est déclenché lors de l'upload d'une pièce jointe image. Son fonctionnement est le suivant :

**Étape 1 — Upload de fichier :** `PiecesJointesController.Upload()` valide le type MIME (PDF, PNG, JPEG, BMP, TIFF), génère un nom de fichier UUID sécurisé, crée le répertoire de stockage `uploads/courriers/{courrierId}/`, et sauvegarde le fichier sur disque. Les métadonnées sont persistées via `fn_piece_jointe_add`.

**Étape 2 — Extraction OCR :** `TesseractOcrService.ExtractText()` charge le fichier image, initialise le moteur Tesseract avec les données d'entraînement français+anglais+arabe (avec fallback automatique si le fichier arabe est absent ou invalide), configure la résolution à 300 DPI, et retourne le texte extrait avec son score de confiance normalisé en pourcentage.

**Étape 3 — Classification automatique :** `RuleBasedOcrClassificationService.Classify()` normalise le texte extrait (suppression des accents, mise en minuscules) et le compare aux dictionnaires de mots-clés de huit catégories prédéfinies :

**Tableau 4 — Catégories de classification automatique et mots-clés associés**

| Catégorie | Exemples de mots-clés (fr/en) |
|---|---|
| Human Resources | congé, absence, employé, recrutement, salaire, formation, leave, employee |
| Financial | budget, facture, paiement, trésorerie, virement, invoice, accounting |
| Legal | contrat, plainte, tribunal, contentieux, mise en demeure, contract, dispute |
| Technical | maintenance, informatique, système, réseau, serveur, panne, IT support |
| Administrative | dossier, demande, autorisation, circulaire, note interne, organization |
| Archive | archivage, stockage, classement, conservation, document archive |
| External | courrier entrant, partenaire, client, fournisseur, incoming correspondence |
| Internal | note interne, service interne, département, correspondance interne |

La catégorie retenue est celle dont le plus grand nombre de mots-clés apparaissent dans le texte. Le score de confiance est calculé par la formule `min(95, 50 + nombre_de_mots_clés × 15)`. Si aucun mot-clé n'est détecté, le système retourne un résultat vide sans forcer une catégorie.

**Étape 4 — Confirmation OCR :** La méthode `PieceJointe.ConfirmOcr()` appelle la fonction PostgreSQL `fn_piece_jointe_confirm_ocr` qui persiste atomiquement le résultat OCR, la classification proposée, et met à jour le texte OCR indexé du courrier. L'agent peut ultérieurement corriger le texte et/ou la catégorie manuellement.

#### III.4 Module de notifications

Le système de notifications est conçu pour informer les utilisateurs de tout événement significatif affectant les courriers qui les concernent. La classe `Notification.CreateForUser()` est le point d'entrée unique pour la création de notifications. Elle accepte les paramètres suivants : identifiant du destinataire, titre, message, type (CourrierAssigned, CourrierStatusChanged), type d'entité (Courrier), identifiant de l'entité, et identifiant de l'auteur.

Deux modes de consultation sont disponibles :
- **Notifications personnelles** (`GET /api/Notifications`) : toutes les notifications destinées directement à l'utilisateur courant.
- **Notifications par catégorie** (`GET /api/Notifications/lecteur` et `/api/Notifications/SuperAgent`) : notifications des courriers appartenant à la catégorie assignée à l'utilisateur, filtrées via une jointure `notifications ⋈ courrier ⋈ user_categorie_access`.

#### III.5 Tableaux de bord et rapports

Trois tableaux de bord sont proposés, adaptés à chaque profil :

**Dashboard Administrateur** : agrège via des sous-requêtes PostgreSQL les comptes globaux (utilisateurs totaux, agents, lecteurs, courriers entrants/sortants/en attente/archivés) et les dix dernières activités (créations de courriers, archivages, ajouts d'utilisateurs) ordonnées par horodatage décroissant.

**Dashboard Agent/SuperAgent** : fournit à chaque agent sa propre vue personnalisée : statistiques de ses courriers (entrants, sortants, en attente, brouillons, scans des 30 derniers jours), liste des 5 courriers entrants les plus récents qui lui sont assignés, 8 dernières activités (créations, changements de statut, résultats OCR) avec libellé de temps relatif (« 5 min ago », « 2 h ago »), et 3 derniers résultats OCR avec extrait du texte.

**Dashboard Lecteur/SuperAgent** : fournit une vue centrée sur la catégorie assignée : décomptes de courriers entrants, sortants, archivés, non lus, semaine courante ; 5 documents récents avec leurs métadonnées clés ; 5 mises à jour récentes (nouvelles entrées et changements de statut) ; et la date de dernière mise à jour de la catégorie.

**Module Rapports** (Admin uniquement) : génère un rapport de synthèse paramétrable par période (7j, 30j, 3m, 6m, 1an). Le rapport comprend un résumé (entrants, sortants, en attente, archivés), une répartition mensuelle avec l'opérateur PostgreSQL `FILTER`, une distribution par catégorie avec pourcentage calculé via CTE, une activité par jour de la semaine, et quatre indicateurs clés (taux de traitement, délai moyen estimé, courriers en retard avec dépassement de `date_echeance`, taux d'archivage).

### IV. Conclusion {#iv-conclusion-2}

Ce second chapitre a présenté en détail la réalisation technique du système Bureau d'Ordre Intelligent. L'application développée couvre l'intégralité du périmètre fonctionnel défini en conception : authentification sécurisée par JWT, gestion complète des courriers entrants et sortants avec historique, traitement OCR multilingue, classification automatique par règles, gestion des pièces jointes, notifications contextuelles, tableaux de bord personnalisés par rôle, et rapports analytiques. L'architecture en trois couches strictement séparées, l'utilisation de procédures stockées PostgreSQL pour les opérations critiques, et l'injection de dépendances pour les services techniques garantissent la robustesse, la sécurité et la maintenabilité de la solution.

---

## CONCLUSION GÉNÉRALE ET PERSPECTIVES

Le présent projet a abouti à la conception et au développement d'un système complet de gestion intelligente du bureau d'ordre, répondant à un besoin organisationnel réel et prégnant. La solution développée, intitulée **Bureau d'Ordre Intelligent**, remplace efficacement les pratiques manuelles par un écosystème numérique intégré, accessible depuis des terminaux mobiles Android, et reposant sur un backend REST robuste.

Sur le plan technique, le projet a permis de mettre en œuvre un ensemble cohérent de technologies modernes : ASP.NET Core (.NET 10) pour le backend, React Native avec Expo pour le frontend, PostgreSQL pour la persistance, Docker pour le déploiement, Tesseract pour l'OCR, JWT et BCrypt pour la sécurité. La modularité de l'architecture, illustrée notamment par l'abstraction des services OCR et classification derrière des interfaces C#, garantit que le système peut évoluer indépendamment de ses composants techniques.

Sur le plan fonctionnel, le système couvre l'intégralité du cycle de vie du courrier et offre à chaque profil d'utilisateur une expérience adaptée à ses responsabilités : l'Administrateur dispose d'une vision globale et d'un contrôle total sur les comptes et les paramètres ; l'Agent gère activement ses courriers assignés avec un support OCR et de classification ; le SuperAgent supervise une catégorie entière ; le Lecteur consulte en lecture seule les courriers de sa catégorie.

Cependant, plusieurs axes d'amélioration et d'extension sont envisagés pour les versions futures du système :

- **Intégration d'un moteur OCR cloud** (Google Vision API, Azure Cognitive Services) pour améliorer la précision, notamment sur les documents manuscrits ou de faible qualité.
- **Remplacement du classifieur par règles par un modèle de machine learning** (SVM, BERT multilingue) entraîné sur un corpus de courriers réels, afin d'améliorer la précision et la robustesse de la classification automatique.
- **Développement d'une interface web** en complément de l'application mobile, pour les utilisateurs qui préfèrent travailler sur poste fixe.
- **Mise en place de workflows d'approbation** multi-niveaux pour les courriers sortants sensibles.
- **Intégration d'une signature électronique** pour la validation formelle des courriers sortants.
- **Exportation des rapports** en PDF et Excel pour un partage facilité avec la direction.
- **Mise en place de tests automatisés** (unitaires, d'intégration) pour sécuriser les évolutions futures.
- **Déploiement sur infrastructure cloud** (AWS, Azure, GCP) avec mise à l'échelle automatique pour les grandes organisations.

En somme, ce projet constitue une base technique solide et extensible, dont les fondements architecturaux et fonctionnels sont conçus pour accompagner la transformation numérique des organisations sur le long terme.

---

## BIBLIOGRAPHIE

**[1]** Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.

**[2]** Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003.

**[3]** Andrew Lock, *ASP.NET Core in Action*, Manning Publications, 3e édition, 2023.

**[4]** Documentation officielle Microsoft — ASP.NET Core. [https://learn.microsoft.com/aspnet/core](https://learn.microsoft.com/aspnet/core). Consultée le 01-04-2026.

**[5]** Documentation officielle PostgreSQL 15. [https://www.postgresql.org/docs/15/](https://www.postgresql.org/docs/15/). Consultée le 01-04-2026.

**[6]** Documentation officielle React Native. [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started). Consultée le 01-04-2026.

**[7]** Documentation Expo. [https://docs.expo.dev/](https://docs.expo.dev/). Consultée le 01-04-2026.

**[8]** Tesseract OCR — GitHub. [https://github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract). Consultée le 01-04-2026.

**[9]** RFC 7519 — JSON Web Token (JWT). [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519). Consultée le 15-03-2026.

**[10]** Grady Booch, James Rumbaugh, Ivar Jacobson, *The Unified Modeling Language User Guide*, Addison-Wesley, 2e édition, 2005.

---

## ANNEXE A — Modèle de la base de données (ERD)

L'ERD du système présente les tables suivantes avec leurs relations :

**Tables et contraintes principales :**

```
ROLE (id PK, nom, description)

USER (id PK, username, firstname, lastname, email,
      mot_de_passe_hash, role_id FK→ROLE, isactif,
      created_at, updated_at, image_path)

CATEGORIE (id PK, nom, description)

user_categorie_access (user_id FK→USER, categorie_id FK→CATEGORIE)
  -- Table de jonction : assigne une catégorie à un Lecteur/SuperAgent

COURRIER (id PK, reference UNIQUE, type, date_courrier,
          expediteur, destinataire, objet, description,
          statut, texte_ocr, categorie_id FK→CATEGORIE,
          auteur_id FK→USER, assigne_a FK→USER,
          created_at, updated_at, date_echeance)

PIECE_JOINTE (id PK, courrier_id FK→COURRIER,
              nom_fichier, type_fichier, chemin_fichier,
              format, taille, est_scan, created_at)

OCR_RESULTAT (id PK, piece_jointe_id FK→PIECE_JOINTE,
              texte_extrait, confiance, created_at)

CLASSIFICATION_COURRIER (id PK, courrier_id FK→COURRIER,
                          categorie_id FK→CATEGORIE,
                          score_confiance, methode,
                          validee, corrigee_manuellement)

HISTORIQUE_STATUT (id PK, courrier_id FK→COURRIER,
                   ancien_statut, nouveau_statut,
                   modifie_par FK→USER, commentaire, changed_at)

NOTIFICATIONS (id PK, user_id FK→USER, title, message, type,
               entity_type, entity_id, is_read,
               created_by FK→USER, created_at, read_at)
```

**Procédures stockées principales :**
- `sp_get_all_users()`, `sp_get_user_by_id(p_user_id)`, `sp_get_user_by_email(p_email)`
- `sp_add_user(...)`, `sp_update_user(...)`, `sp_delete_user(p_user_id)`
- `sp_get_all_courriers()`, `sp_get_courrier_by_id(p_id)`
- `sp_add_courrier(...)`, `sp_update_courrier(...)`, `sp_delete_courrier(p_id)`
- `sp_get_courriers_by_assigne_a(p_user_id)`
- `fn_courrier_update_statut_with_history(courrierId, nouveauStatut, modifiePar, commentaire)`
- `fn_piece_jointe_add(...)`, `fn_piece_jointe_get_by_courrier_id(...)`, `fn_piece_jointe_confirm_ocr(...)`
- `fn_historique_statut_get_by_courrier(courrierId)`
- `sp_add_notification(...)`, `sp_get_notifications_by_user(p_user_id, p_only_unread)`
- `sp_mark_notification_as_read(p_id, p_user_id)`, `sp_mark_all_notifications_as_read(p_user_id)`
- `sp_delete_notification(p_id, p_user_id)`, `sp_get_unread_notifications_count(p_user_id)`

---

## ANNEXE B — Diagramme de classes complet

Le diagramme de classes complet du système, modélisé en PlantUML, est structuré selon les regroupements suivants :

**Énumérations :**
```
enum TypeCourrier        { ENTRANT, SORTANT }
enum StatutCourrierEntrant { A_TRAITER, EN_TRAITEMENT, TRAITE, ARCHIVE }
enum StatutCourrierSortant { BROUILLON, PRET, ENVOYE, ARCHIVE }
enum TypePieceJointe     { IMAGE, PDF, SCAN }
enum CanalNotification   { IN_APP, PUSH }
enum EtatSession         { ACTIVE, EXPIREE, FERMEE }
```

**Hiérarchie Utilisateur :**
```
abstract Utilisateur → Admin, Agent, Lecteur
Utilisateur *-- SessionUtilisateur (1 à 0..*)
```

**Hiérarchie Courrier :**
```
abstract Courrier → CourrierEntrant, CourrierSortant
Courrier *-- PieceJointe (1 à 0..*)
PieceJointe *-- ScanDocument (1 à 0..1)
ScanDocument *-- OCRResultat (1 à 0..1)
Courrier o-- ClassificationCourrier (1 à 0..1)
Courrier *-- HistoriqueStatut (1 à 0..*)
Courrier --> Notification (1 à 0..*)
```

**Associations utilisateur-courrier :**
```
Utilisateur --> Courrier : auteur (1 à 0..*)
Agent --> Courrier : assigne/traite (0..1 à 0..*)
Utilisateur --> Notification : reçoit (1 à 0..*)
Utilisateur --> HistoriqueStatut : effectue (1 à 0..*)
Utilisateur --> ClassificationCourrier : validePar (0..1 à 0..*)
Admin --> ParametreSysteme : gere (1 à 0..*)
```