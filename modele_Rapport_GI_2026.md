![](./image1.png){width="4.713542213473316in" height="2.302215660542432in"}

**Département : Mathématiques et Informatique**

**Licence en Génie Informatique**

**Module M365 : Projet d'étude et réalisation**

**RAPPORT DU PROJET**

**THEME DE PROJET**

**Application Mobile de Gestion Intelligente du Bureau d'Ordre et des Archives**

**Présenté par**

M. [NOM ÉTUDIANT 1]
M. [NOM ÉTUDIANT 2]

Soutenue le ....../....../...... à ..............

**Devant le jury**

Pr [NOM PRÉSIDENT] Professeur à la Faculté Polydisciplinaire de Taroudant Président
Pr [NOM EXAMINATEUR] Professeur à la Faculté Polydisciplinaire de Taroudant Examinateur
Pr [NOM ENCADRANT] Professeur à la Faculté Polydisciplinaire de Taroudant Encadrant

Année Universitaire : 2025/2026

---

**REMERCIEMENTS**

Nous tenons à exprimer notre profonde gratitude à toutes les personnes qui ont contribué, de près ou de loin, à la réalisation de ce projet.

Nous remercions vivement notre encadrant, le Professeur [NOM ENCADRANT], pour sa disponibilité, ses conseils avisés, son suivi rigoureux et la confiance qu'il nous a accordée tout au long de ce travail. Ses orientations précieuses nous ont permis de mener à bien ce projet dans les meilleures conditions.

Nous adressons nos sincères remerciements aux membres du jury qui nous font l'honneur d'évaluer notre travail. Leurs remarques et suggestions seront d'une grande utilité pour l'amélioration de notre projet.

Nous remercions également l'ensemble du corps professoral du Département de Mathématiques et Informatique de la Faculté Polydisciplinaire de Taroudant pour la qualité de la formation dispensée tout au long de notre cursus universitaire.

Nous n'oublions pas nos familles, nos amis et tous ceux qui nous ont soutenus moralement et matériellement durant cette période de travail intense. Leur patience, leur compréhension et leurs encouragements ont été d'un soutien inestimable.

Enfin, nous remercions toutes les personnes qui ont participé aux tests et à la validation de notre application, leurs retours ont grandement contribué à l'amélioration du produit final.

---

**RESUME**

Ce projet s'inscrit dans le cadre du module M365 - Projet d'étude et réalisation de la Licence en Génie Informatique. Il vise à concevoir et développer une application mobile intelligente pour la gestion du Bureau d'Ordre et des Archives au sein d'une administration publique.

La gestion du courrier administratif représente un défi majeur pour les organisations modernes, en particulier dans le secteur public où le volume de documents traités quotidiennement est considérable. Les méthodes traditionnelles basées sur le papier et les registres physiques présentent des limitations importantes en termes de traçabilité, de rapidité de traitement et d'accessibilité à l'information.

Notre projet propose une solution complète comprenant une application mobile développée avec React Native et Expo, couplée à une API RESTful construite avec ASP.NET Core. L'application permet la gestion des courriers entrants et sortants, le scan et l'extraction automatique de texte par OCR (Reconnaissance Optique de Caractères) via Tesseract, la classification automatique des documents basée sur des règles métier, ainsi que le suivi complet du cycle de vie des courriers avec notification en temps réel.

L'architecture du système suit les principes du Clean Architecture avec une séparation claire entre les couches de présentation, domaine et données. Le backend est organisé en quatre couches distinctes (Présentation, Business Layer, Data Access, DTO) tandis que le frontend adopte une architecture modulaire par fonctionnalité. La base de données PostgreSQL assure la persistance des données avec un schéma relationnel optimisé incluant des procédures stockées et des triggers pour garantir l'intégrité des données.

Les résultats obtenus démontrent l'efficacité de la solution proposée : l'application permet une réduction significative du temps de traitement des courriers, une amélioration de la traçabilité et une meilleure collaboration entre les différents acteurs (Administrateurs, Agents, Super Agents, Lecteurs).

**Mots-clés :** Application Mobile, Gestion de Courrier, Bureau d'Ordre, OCR, React Native, ASP.NET Core, PostgreSQL, Clean Architecture, Classification Automatique.

---

**ABSTRACT**

This project is part of the M365 module - Study and Realization Project of the Computer Engineering Bachelor's degree. It aims at designing and developing an intelligent mobile application for managing the Registry Office and Archives within a public administration.

Administrative mail management represents a major challenge for modern organizations, particularly in the public sector where the volume of documents processed daily is considerable. Traditional paper-based methods and physical registers have significant limitations in terms of traceability, processing speed, and information accessibility.

Our project proposes a comprehensive solution including a mobile application developed with React Native and Expo, coupled with a RESTful API built with ASP.NET Core. The application enables management of incoming and outgoing correspondence, document scanning and automatic text extraction through OCR (Optical Character Recognition) via Tesseract, automatic document classification based on business rules, as well as complete tracking of the mail lifecycle with real-time notifications.

The system architecture follows Clean Architecture principles with a clear separation between presentation, domain, and data layers. The backend is organized into four distinct layers (Presentation, Business Layer, Data Access, DTO) while the frontend adopts a modular architecture by feature. The PostgreSQL database ensures data persistence with an optimized relational schema including stored procedures and triggers to guarantee data integrity.

The obtained results demonstrate the effectiveness of the proposed solution: the application enables a significant reduction in mail processing time, improved traceability, and better collaboration between different actors (Administrators, Agents, Super Agents, Readers).

**Keywords:** Mobile Application, Mail Management, Registry Office, OCR, React Native, ASP.NET Core, PostgreSQL, Clean Architecture, Automatic Classification.

---

**INTRODUCTION GENERALE**

La transformation numérique des administrations publiques est devenue une priorité stratégique à l'échelle mondiale. Dans ce contexte, la gestion efficace du courrier administratif et des archives constitue un pilier fondamental de la modernisation des services publics. Chaque jour, les administrations traitent des volumes considérables de documents officiels, de correspondances, de circulaires et de décisions qui nécessitent un suivi rigoureux et une traçabilité sans faille.

Le Bureau d'Ordre, en tant que service central de réception, d'enregistrement, d'orientation et de suivi du courrier, joue un rôle crucial dans le fonctionnement de toute organisation administrative. Cependant, les méthodes traditionnelles de gestion, souvent basées sur des registres papiers et des processus manuels, présentent des lacunes importantes : lenteur de traitement, risques d'égarement de documents, difficultés de recherche et d'archivage, absence de traçabilité en temps réel, et collaboration limitée entre les services.

Face à ces constats, la nécessité d'une solution informatisée et intelligente s'impose. Les avancées technologiques récentes dans les domaines du développement mobile, de l'intelligence artificielle et de la reconnaissance optique de caractères offrent des opportunités considérables pour repenser la gestion documentaire administrative.

C'est dans cette optique que s'inscrit notre projet de fin d'études, qui vise à concevoir et développer une application mobile intelligente pour la gestion du Bureau d'Ordre et des Archives. Notre solution se distingue par plusieurs caractéristiques innovantes :

Premièrement, elle offre une interface mobile intuitive et ergonomique développée avec React Native, permettant aux agents administratifs de gérer le courrier depuis n'importe quel endroit, à tout moment. L'application supporte aussi bien les systèmes Android que iOS, garantissant une large accessibilité.

Deuxièmement, elle intègre un moteur OCR (Tesseract) pour l'extraction automatique du texte à partir de documents scannés, éliminant ainsi la saisie manuelle fastidieuse et réduisant les risques d'erreurs humaines.

Troisièmement, elle implémente un système de classification automatique basé sur des règles métier, capable de suggérer la catégorie appropriée pour chaque document en fonction de son contenu textuel.

Quatrièmement, elle assure une gestion complète du cycle de vie des courriers, depuis leur réception jusqu'à leur archivage, en passant par le traitement, l'assignation et le suivi des statuts, avec un système de notifications en temps réel.

Cinquièmement, elle propose une architecture multicouche robuste et évolutive, avec un backend ASP.NET Core offrant une API RESTful sécurisée par authentification JWT et une base de données PostgreSQL optimisée.

Le présent rapport est structuré en deux chapitres principaux. Le premier chapitre présente l'analyse des besoins et les spécifications du système, incluant l'étude de l'existant, les exigences fonctionnelles et non-fonctionnelles, ainsi que les cas d'utilisation. Le second chapitre détaille la conception et la réalisation du système, couvrant l'architecture logicielle, la modélisation de la base de données, l'implémentation du backend et du frontend, et les technologies utilisées. Enfin, une conclusion générale dresse le bilan du travail accompli et propose des perspectives d'amélioration.

---

**TABLE DES MATIERES**

REMERCIEMENTS
RESUME
ABSTRACT
INTRODUCTION GENERALE
TABLE DES MATIERES
LISTE DES ABREVIATIONS
LISTE DES FIGURES
LISTE DES TABLEAUX
CHAPITRE 1 : ANALYSE ET SPECIFICATION DES BESOINS
   I. Introduction
   II. Contexte et problématique
      II.1 Présentation du Bureau d'Ordre
      II.2 Problématique et constats
      II.3 Objectifs du projet
   III. Analyse des besoins
      III.1 Besoins fonctionnels
      III.2 Besoins non-fonctionnels
      III.3 Acteurs du système
      III.4 Cas d'utilisation
   IV. Technologies et outils
      IV.1 Technologies frontend
      IV.2 Technologies backend
      IV.3 Base de données
      IV.4 Outils de développement
   V. Conclusion
CHAPITRE 2 : CONCEPTION ET REALISATION
   I. Introduction
   II. Architecture du système
      II.1 Architecture globale
      II.2 Architecture backend
      II.3 Architecture frontend
      II.4 Architecture de la base de données
   III. Implémentation du backend
      III.1 Couche de présentation (API)
      III.2 Couche métier
      III.3 Couche d'accès aux données
      III.4 Authentification et autorisation
      III.5 Pipeline OCR et classification
   IV. Implémentation du frontend
      IV.1 Structure du projet
      IV.2 Composants et écrans
      IV.3 Gestion d'état et navigation
      IV.4 Communication avec l'API
      IV.5 Tests et validation
   V. Déploiement
      V.1 Environnement de développement
      V.2 Docker et conteneurisation
      V.3 Procédure de déploiement
   VI. Conclusion
CONCLUSION GENERALE ET PERSPECTIVES
BIBLIOGRAPHIE
ANNEXES

---

**LISTE DES ABREVIATIONS**

| Abréviation | Signification |
|-------------|---------------|
| API | Application Programming Interface |
| ASP.NET | Active Server Pages .NET |
| BDO | Bureau d'Ordre |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| ERD | Entity-Relationship Diagram |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HyperText Transfer Protocol Secure |
| IDE | Integrated Development Environment |
| IIS | Internet Information Services |
| JWT | JSON Web Token |
| OCR | Optical Character Recognition / Reconnaissance Optique de Caractères |
| PFE | Projet de Fin d'Études |
| REST | Representational State Transfer |
| SDK | Software Development Kit |
| SQL | Structured Query Language |
| UI | User Interface |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |

---

**LISTE DES FIGURES**

Figure 1 : Diagramme de cas d'utilisation général
Figure 2 : Diagramme de classes du domaine Courrier
Figure 3 : Architecture globale du système
Figure 4 : Architecture en couches du backend
Figure 5 : Architecture Clean Architecture du frontend
Figure 6 : Schéma entité-relation de la base de données
Figure 7 : Diagramme de séquence - Authentification
Figure 8 : Diagramme de séquence - Pipeline OCR
Figure 9 : Interface de connexion
Figure 10 : Tableau de bord Administrateur
Figure 11 : Liste des courriers
Figure 12 : Détail d'un courrier
Figure 13 : Formulaire de création de courrier
Figure 14 : Interface OCR et classification
Figure 15 : Interface de notification

---

**LISTE DES TABLEAUX**

Tableau 1 : Comparaison des solutions existantes
Tableau 2 : Exigences fonctionnelles
Tableau 3 : Exigences non-fonctionnelles
Tableau 4 : Description des acteurs du système
Tableau 5 : Cas d'utilisation principaux
Tableau 6 : Rôles et permissions
Tableau 7 : Technologies et versions utilisées
Tableau 8 : Structure des tables de la base de données
Tableau 9 : Endpoints de l'API REST
Tableau 10 : Résultats des tests de performance

---

**CHAPITRE 1 : ANALYSE ET SPECIFICATION DES BESOINS**

**I. Introduction**

La gestion du courrier administratif constitue une fonction névralgique au sein de toute organisation publique ou privée. Dans le contexte spécifique des administrations marocaines, le Bureau d'Ordre représente le point central de réception, d'enregistrement, d'orientation et de suivi de l'ensemble des correspondances. Avec la croissance continue du volume des échanges administratifs et l'exigence croissante de transparence et d'efficacité, les méthodes traditionnelles de gestion papier montrent leurs limites.

Ce premier chapitre pose les fondements de notre projet en présentant une analyse approfondie du contexte, de la problématique et des besoins auxquels notre application doit répondre. Nous commencerons par une étude du contexte et du fonctionnement actuel du Bureau d'Ordre, suivie d'une identification des problèmes et des objectifs du projet. Ensuite, nous détaillerons l'analyse des besoins fonctionnels et non-fonctionnels, la description des acteurs du système, et les cas d'utilisation. Enfin, nous présenterons les technologies et outils retenus pour la réalisation du projet.

**II. Contexte et problématique**

**II.1 Présentation du Bureau d'Ordre**

Le Bureau d'Ordre est un service administratif chargé de la gestion centralisée du courrier au sein d'une organisation. Ses missions principales comprennent :

- La réception et l'enregistrement de l'ensemble des correspondances entrantes (courriers officiels, circulaires, décisions, notes de service, etc.)
- L'orientation et la distribution du courrier vers les services et personnes concernés
- L'expédition du courrier sortant
- Le suivi et la traçabilité de l'ensemble des flux documentaires
- L'archivage et la conservation des documents
- La délivrance d'accusés de réception et de certificats de dépôt

Dans les administrations publiques marocaines, le Bureau d'Ordre joue un rôle particulièrement important car il constitue le circuit officiel de transmission des informations et des décisions administratives. La rigueur et l'efficacité de son fonctionnement impactent directement la qualité du service public rendu aux citoyens.

**II.2 Problématique et constats**

L'analyse du fonctionnement actuel du Bureau d'Ordre dans les administrations publiques révèle plusieurs problèmes récurrents :

1. **Gestion manuelle et papier** : La majorité des bureaux d'ordre utilisent encore des registres physiques pour l'enregistrement du courrier. Cette méthode entraîne des risques d'erreurs de transcription, de perte de documents et de dégradation des registres avec le temps.

2. **Lenteur des traitements** : Le circuit du courrier administratif implique de nombreuses étapes manuelles : réception, enregistrement sur registre, saisie, orientation physique, distribution, traitement, et archivage. Chaque étape introduit des délais qui allongent considérablement le temps global de traitement.

3. **Absence de traçabilité en temps réel** : Une fois le courrier orienté vers un service, il devient difficile pour l'expéditeur ou l'administration centrale de connaître son état d'avancement. Le suivi nécessite des relances téléphoniques ou des déplacements physiques.

4. **Difficultés de recherche et d'archivage** : La recherche d'un courrier spécifique dans des registres papiers est fastidieuse et chronophage. L'archivage physique requiert des espaces de stockage importants et rend l'accès aux documents anciens difficile.

5. **Collaboration limitée** : Les différents acteurs (agents, responsables, lecteurs) ne disposent pas d'outils leur permettant de collaborer efficacement autour des documents. Les notifications et alertes sont inexistantes ou informelles.

6. **Absence de capacités intelligentes** : Les systèmes existants ne permettent pas l'exploitation du contenu des documents pour leur classification automatique ou leur recherche sémantique.

**II.3 Objectifs du projet**

Face aux constats établis, notre projet vise à atteindre les objectifs suivants :

1. **Dématérialiser** complètement le processus de gestion du courrier, de la réception à l'archivage
2. **Automatiser** la saisie des informations grâce à la reconnaissance optique de caractères (OCR)
3. **Faciliter** la recherche et la consultation du courrier via des filtres et une interface intuitive
4. **Assurer** une traçabilité complète avec historique des statuts et notifications
5. **Permettre** une collaboration efficace entre les différents acteurs via des fonctionnalités d'assignation et de réassignation
6. **Classifier** automatiquement les documents en fonction de leur contenu pour faciliter leur traitement
7. **Offrir** une accessibilité mobile permettant la gestion du courrier à distance
8. **Garantir** la sécurité des données via une authentification robuste et un contrôle d'accès basé sur les rôles

**III. Analyse des besoins**

**III.1 Besoins fonctionnels**

L'analyse détaillée du processus de gestion du courrier nous a permis d'identifier les besoins fonctionnels suivants, organisés par module :

**Module Authentification :**
- L'utilisateur doit pouvoir s'authentifier avec son email et son mot de passe
- Le système doit délivrer un jeton JWT pour sécuriser les sessions
- L'utilisateur doit pouvoir modifier son mot de passe
- Le système doit gérer les sessions et leur expiration

**Module Gestion des Courriers :**
- L'utilisateur doit pouvoir créer un courrier entrant ou sortant avec toutes les informations nécessaires (référence, date, expéditeur/destinataire, objet, description, catégorie)
- L'utilisateur doit pouvoir modifier un courrier existant
- L'utilisateur doit pouvoir consulter la liste des courriers avec des options de filtrage et de recherche
- L'utilisateur doit pouvoir visualiser le détail complet d'un courrier
- L'utilisateur doit pouvoir changer le statut d'un courrier (En attente, En traitement, Traité, Archivé, etc.)
- L'utilisateur doit pouvoir assigner ou réassigner un courrier à un autre utilisateur
- L'utilisateur doit pouvoir archiver un courrier
- Le système doit permettre la recherche de courriers par mot-clé, date, statut, catégorie

**Module OCR et Classification :**
- L'utilisateur doit pouvoir joindre des fichiers (images, PDF) à un courrier
- Le système doit extraire automatiquement le texte des images scannées via OCR
- Le système doit proposer une catégorie pour chaque document basée sur l'analyse de son contenu
- L'utilisateur doit pouvoir prévisualiser le résultat OCR avant validation
- L'utilisateur doit pouvoir corriger manuellement le texte OCR extrait
- L'utilisateur doit pouvoir confirmer ou rejeter la classification proposée

**Module Notifications :**
- Le système doit notifier les utilisateurs lors de l'assignation d'un courrier
- Le système doit notifier les utilisateurs lors des changements de statut
- L'utilisateur doit pouvoir consulter ses notifications
- L'utilisateur doit pouvoir marquer les notifications comme lues
- Le système doit afficher un compteur de notifications non lues

**Module Tableau de Bord :**
- L'administrateur doit avoir un tableau de bord avec des statistiques globales (nombre de courriers, tendances, activités récentes)
- L'Agent doit avoir un tableau de bord personnalisé avec ses courriers assignés et ses résultats OCR
- Le Lecteur doit avoir un tableau de bord avec les courriers de sa catégorie

**Module Gestion des Utilisateurs (Admin) :**
- L'administrateur doit pouvoir créer, modifier et supprimer des utilisateurs
- L'administrateur doit pouvoir activer ou désactiver des utilisateurs
- L'administrateur doit pouvoir assigner des rôles aux utilisateurs
- L'administrateur doit pouvoir assigner des catégories aux Lecteurs

**Module Rapports :**
- L'administrateur doit pouvoir consulter des rapports statistiques avec différentes périodes

**III.2 Besoins non-fonctionnels**

Les exigences non-fonctionnelles identifiées sont les suivantes :

| Réf. | Exigence | Description |
|------|----------|-------------|
| NF1 | Sécurité | L'authentification doit utiliser JWT avec chiffrement HMAC-SHA256. Les mots de passe doivent être hachés avec BCrypt. Les accès aux ressources doivent être contrôlés par rôles et politiques d'autorisation. |
| NF2 | Performance | Les temps de réponse de l'API doivent être inférieurs à 500ms pour les opérations courantes. L'extraction OCR doit s'exécuter en moins de 10 secondes par page. |
| NF3 | Disponibilité | L'application doit être disponible 99% du temps. Le backend doit supporter les redémarrages sans perte de données. |
| NF4 | Évolutivité | L'architecture doit permettre l'ajout de nouvelles fonctionnalités sans impact sur les modules existants. |
| NF5 | Portabilité | L'application mobile doit fonctionner sur Android 8+ et iOS 15+. Le backend doit être déployable sur Windows et Linux via Docker. |
| NF6 | Maintenabilité | Le code doit suivre les principes SOLID et Clean Architecture. La documentation technique doit accompagner chaque module. |
| NF7 | Utilisabilité | L'interface doit être intuitive et adaptée aux écrans mobiles. Les actions courantes doivent être accessibles en 3 clics maximum. |
| NF8 | Intégrité des données | Les transactions doivent être protégées. L'historique des modifications doit être conservé pour garantir la traçabilité. |

**III.3 Acteurs du système**

L'analyse des utilisateurs du système a permis d'identifier quatre acteurs principaux :

| Acteur | Rôle | Description |
|--------|------|-------------|
| **Administrateur** | Admin | Gère les utilisateurs et leurs rôles, consulte l'ensemble des courriers, accède aux rapports et statistiques, configure le système. Dispose de tous les privilèges. |
| **Agent** | Agent | Crée et modifie les courriers, exécute l'OCR, change les statuts, gère les pièces jointes. Accès limité à ses propres courriers et à ceux qui lui sont assignés. |
| **Super Agent** | SuperAgent | Hérite des permissions de l'Agent avec des droits supplémentaires : réassignation des courriers, accès par catégorie, tableau de bord Lecteur. |
| **Lecteur** | Lecteur | Accès en lecture seule aux courriers de sa catégorie d'assignation. Consulte le tableau de bord, les notifications et l'historique. |

**III.4 Cas d'utilisation**

Le diagramme de cas d'utilisation général du système se compose des cas principaux suivants :

**Cas d'utilisation généraux :**
1. S'authentifier : L'utilisateur saisit son email et son mot de passe pour accéder au système.
2. Gérer les courriers entrants : Créer, consulter, modifier et suivre les courriers reçus.
3. Gérer les courriers sortants : Créer, consulter et suivre les courriers émis.
4. Scanner un document : Capturer une image de document via la caméra du téléphone.
5. Exécuter l'OCR : Extraire automatiquement le texte d'un document scanné.
6. Classifier un document : Proposer une catégorie automatique basée sur le contenu textuel.
7. Ajouter des pièces jointes : Joindre des fichiers (images, PDF) à un courrier.
8. Rechercher et filtrer : Rechercher des courriers par mot-clé, statut, catégorie, date.
9. Suivre le statut et l'historique : Visualiser l'évolution du traitement d'un courrier.
10. Recevoir des notifications : Être informé des assignations et des changements de statut.
11. Gérer les utilisateurs (Admin) : Créer, modifier, activer/désactiver des comptes utilisateurs.
12. Consulter les rapports (Admin) : Visualiser les statistiques et indicateurs de performance.

**IV. Technologies et outils**

Le choix des technologies pour ce projet a été guidé par les critères suivants : maturité des solutions, communauté active, documentation riche, performances, et adéquation avec les besoins du projet.

**IV.1 Technologies frontend**

| Technologie | Version | Rôle |
|-------------|---------|------|
| React Native | 0.81.5 | Framework de développement mobile multiplateforme |
| Expo | SDK 54 | Plateforme de développement et d'outillage React Native |
| TypeScript | ~5.9 | Langage de programmation typé |
| React Navigation | 7.x | Bibliothèque de navigation entre écrans |
| NativeWind | 4.2.3 | Utilitaire CSS pour le styling (Tailwind CSS pour React Native) |
| Axios | 1.15.0 | Client HTTP pour les appels API |
| AsyncStorage | 2.2.0 | Stockage local persistant (jetons JWT) |
| Expo Camera | ~15.0 | Accès à l'appareil photo pour le scan de documents |
| Expo Image Picker | ~17.0 | Sélection d'images depuis la galerie |

React Native a été choisi pour sa capacité à produire des applications natives pour Android et iOS à partir d'une base de code unique, réduisant ainsi les coûts et les délais de développement. Expo simplifie considérablement le processus de développement en fournissant des outils de build, de déploiement et de test prêts à l'emploi.

TypeScript a été retenu pour sa sûreté de typage qui permet de détecter les erreurs à la compilation et d'améliorer la maintenabilité du code. NativeWind permet d'utiliser une syntaxe Tailwind CSS familière pour le styling, accélérant le développement des interfaces.

**IV.2 Technologies backend**

| Technologie | Version | Rôle |
|-------------|---------|------|
| ASP.NET Core | 10.0 | Framework de développement d'API RESTful |
| C# | 12.0 | Langage de programmation |
| Entity Framework | Non utilisé | Accès direct via ADO.NET/Npgsql |
| Npgsql | 10.0.2 | Pilote PostgreSQL pour .NET |
| BCrypt.Net-Next | 4.1.0 | Hachage et vérification des mots de passe |
| JWT Bearer | 10.0.6 | Authentification par jetons |
| Swashbuckle | 9.0.6 | Documentation interactive de l'API (Swagger) |
| Tesseract | 5.2.0 | Moteur de reconnaissance optique de caractères |

ASP.NET Core a été choisi pour ses performances élevées, sa richesse fonctionnelle, son écosystème mature et son excellent support du modèle MVC (Model-View-Controller) pour la construction d'APIs RESTful. Le framework offre des fonctionnalités intégrées pour l'authentification JWT, la validation des modèles, la gestion des erreurs et la documentation via Swagger.

Tesseract est le moteur OCR open source le plus réputé. Il supporte de nombreuses langues dont le français, l'anglais et l'arabe, ce qui le rend parfaitement adapté au contexte marocain.

**IV.3 Base de données**

PostgreSQL a été choisi comme système de gestion de base de données pour sa fiabilité, ses performances, son support des fonctionnalités avancées (procédures stockées, triggers, vues, contraintes complexes) et son coût nul (open source). La version 15 Alpine utilisée en conteneur Docker offre un bon équilibre entre fonctionnalités et légèreté.

**IV.4 Outils de développement**

| Outil | Utilisation |
|-------|-------------|
| Visual Studio 2022 | IDE principal pour le développement backend |
| VS Code | IDE pour le développement frontend |
| Docker Desktop | Conteneurisation des services |
| Git | Gestion de versions |
| Postman | Tests des API |
| pgAdmin | Administration de la base de données |

**V. Conclusion**

Ce premier chapitre nous a permis de poser les bases du projet. L'analyse du contexte a mis en évidence les défis auxquels sont confrontés les bureaux d'ordre dans leur fonctionnement actuel : gestion manuelle, lenteur des traitements, absence de traçabilité en temps réel, difficultés d'archivage et de recherche. Face à ces constats, nous avons défini des objectifs clairs visant à dématérialiser et automatiser le processus de gestion du courrier.

L'analyse des besoins a abouti à une spécification détaillée des fonctionnalités attendues ainsi que des exigences qualité du système. Les cas d'utilisation ont permis de modéliser les interactions entre les différents acteurs et le système. Le choix des technologies a été guidé par les contraintes du projet et les compétences requises pour leur mise en œuvre.

Le chapitre suivant présentera la conception détaillée du système et les aspects de sa réalisation.

---

**CHAPITRE 2 : CONCEPTION ET REALISATION**

**I. Introduction**

Après avoir posé le cadre du projet et défini les spécifications dans le premier chapitre, ce second chapitre est consacré à la conception et la réalisation concrète du système. Nous détaillerons l'architecture globale retenue, la modélisation de la base de données, l'implémentation du backend avec ses différentes couches, la réalisation du frontend mobile, ainsi que les aspects liés au déploiement.

**II. Architecture du système**

**II.1 Architecture globale**

Le système suit une architecture client-serveur classique où l'application mobile frontend communique avec le backend via une API RESTful. Le backend interagit avec une base de données PostgreSQL pour la persistance des données.

L'architecture globale se compose des éléments suivants :

1. **Client mobile** : Application React Native/Expo s'exécutant sur Android ou iOS (ou navigateur web via Expo Web).
2. **API RESTful** : Backend ASP.NET Core exposant des endpoints HTTP sécurisés par JWT.
3. **Stockage de fichiers** : Système de fichiers serveur pour les documents uploadés (pièces jointes, scans OCR).
4. **Base de données** : PostgreSQL hébergeant toutes les données applicatives.
5. **Moteur OCR** : Tesseract, intégré directement dans le backend pour le traitement d'images.

Cette architecture présente plusieurs avantages :
- Séparation claire des responsabilités entre le client et le serveur
- Évolutivité horizontale possible en déployant plusieurs instances du backend
- Sécurité centralisée au niveau de l'API
- Indépendance technologique entre le frontend et le backend

**II.2 Architecture backend**

Le backend est organisé en quatre couches distinctes suivant une architecture en couches classique :

**Couche Présentation (Presentation) :**
Cette couche contient les contrôleurs API qui reçoivent les requêtes HTTP, les valident et les transmettent à la couche métier. Elle inclut également :
- Le middleware d'authentification et d'autorisation JWT
- La configuration Swagger pour la documentation de l'API
- Les services OCR (TesseractOcrService) et de classification (RuleBasedOcrClassificationService)
- Le mappage des DTO (CourrierMapper)

**Couche Métier (Business Layer) :**
Cette couche implémente la logique métier de l'application. Chaque classe (User, Courrier, Categorie, Notification, PieceJointe, HistoriqueStatut, Dashboard, AgentDashboard, LecteurDashboard, Reports) encapsule les règles de gestion correspondant à son domaine. Elle suit le pattern Active Record où chaque objet métier contient à la fois les données et les méthodes pour les sauvegarder.

**Couche d'Accès aux Données (Data Access) :**
Cette couche est responsable de l'interaction avec la base de données PostgreSQL via Npgsql. Elle contient les classes d'accès aux données (UsersData, CourrierData, CategorieData, NotificationData, PieceJointeData, HistoriqueStatutData, DashboardData, AgentDashboardData, LecteurDashboardData, ReportsData) qui exécutent les requêtes SQL et les procédures stockées.

**Couche DTO (Data Transfer Objects) :**
Cette couche définit les objets de transfert de données utilisés pour la communication entre le backend et le frontend. Les DTO assurent une séparation entre les modèles internes et les représentations exposées via l'API.

Le flux des données suit le chemin suivant :
```
Requête HTTP → Contrôleur → Business Layer → Data Access → PostgreSQL
                                 ↓                   ↓
                                DTO                 Résultat
                                 ↓                   ↓
                        Réponse HTTP ← Contrôleur ← Business Layer
```

**II.3 Architecture frontend**

Le frontend adopte une Clean Architecture modulaire. Chaque fonctionnalité (module) est organisée en trois couches :

**Couche Domaine (domain/) :**
- Entités : Modèles métier spécifiques au domaine
- Repository : Interfaces abstraites définissant les contrats d'accès aux données
- Use Cases : Cas d'utilisation implémentant la logique métier spécifique

**Couche Données (data/) :**
- DataSources : Implémentations concrètes des sources de données (API distante)
- Models : Modèles correspondant aux réponses de l'API
- Mappers : Transformations entre les modèles API et les entités du domaine
- Repositories : Implémentations concrètes des interfaces repository

**Couche Présentation (presentation/) :**
- Components : Composants React réutilisables
- Hooks : Hooks React personnalisés orchestrant les use cases
- Screens : Écrans complets de l'application

Cette architecture offre plusieurs avantages :
- Séparation des préoccupations
- Testabilité accrue
- Flexibilité pour changer les sources de données
- Réutilisabilité du code

**II.4 Architecture de la base de données**

La base de données PostgreSQL est conçue avec un schéma relationnel optimisé comprenant 10 tables principales :

1. **roles** : Stocke les rôles utilisateur (Admin, Agent, SuperAgent, Lecteur)
2. **users** : Informations des utilisateurs avec mot de passe haché, lien vers le rôle
3. **categorie** : Catégories de courrier pour la classification
4. **courrier** : Table centrale contenant tous les courriers avec leurs métadonnées
5. **piece_jointe** : Fichiers attachés aux courriers (images, PDF, scans)
6. **ocr_resultat** : Résultats d'extraction OCR par pièce jointe
7. **classification** : Résultats de classification automatique par courrier
8. **historique_statut** : Traçabilité complète des changements de statut
9. **notifications** : Notifications destinées aux utilisateurs
10. **user_categorie_access** : Table d'association pour le contrôle d'accès par catégorie

Le schéma inclut 21 fonctions stockées et procédures qui encapsulent la logique d'accès aux données, et deux triggers pour la validation des accès Lecteur et la mise à jour automatique des horodatages.

**III. Implémentation du backend**

**III.1 Couche de présentation (API)**

Le point d'entrée de l'API est le fichier Program.cs qui configure :
- Les services (contrôleurs, authentification JWT, Swagger, CORS, autorisation)
- Le middleware (Swagger en développement, redirection HTTPS, CORS, authentification, autorisation)
- Le mappage des contrôleurs

Les contrôleurs implémentent les endpoints RESTful suivants :

**AuthController (api/Auth) :**
- `POST /api/Auth/login` : Authentification de l'utilisateur avec email et mot de passe. Vérifie le mot de passe via BCrypt, génère un token JWT contenant les claims (NameIdentifier, Name, Email, Role), et retourne le token avec les informations utilisateur.

**CourrierAPIController (api/Courriers) :**
- `GET /api/Courriers` : Récupère tous les courriers (Admin uniquement)
- `GET /api/Courriers/{id}` : Récupère un courrier par ID (avec vérification de propriété)
- `POST /api/Courriers` : Crée un nouveau courrier
- `PUT /api/Courriers/{id}` : Modifie un courrier existant
- `PUT /api/Courriers/{id}/status` : Change le statut avec enregistrement dans l'historique
- `DELETE /api/Courriers/{id}` : Supprime un courrier (Admin uniquement)
- `GET /api/Courriers/search` : Recherche avec filtres
- `GET /api/Courriers/agent/incoming` : Courriers entrants assignés à l'Agent
- `GET /api/Courriers/agent/outgoing` : Courriers sortants créés par l'Agent
- `PUT /api/Courriers/{id}/reassign` : Réassignation d'un courrier
- `GET /api/Courriers/{id}/history` : Historique complet d'un courrier
- `GET /api/Courriers/lecteur` : Courriers accessibles au Lecteur par catégorie

**PiecesJointesController (api/PiecesJointes) :**
- `GET /api/PiecesJointes/courrier/{courrierId}` : Liste des pièces jointes d'un courrier
- `POST /api/PiecesJointes/courrier/{courrierId}` : Upload d'un fichier
- `GET /api/PiecesJointes/{id}/download` : Téléchargement d'un fichier
- `DELETE /api/PiecesJointes/{id}` : Suppression d'une pièce jointe
- `POST /api/PiecesJointes/{id}/ocr/preview` : Prévisualisation OCR
- `POST /api/PiecesJointes/ocr/preview-file` : OCR sur fichier temporaire
- `POST /api/PiecesJointes/{id}/ocr/confirm` : Confirmation OCR + classification
- `GET /api/PiecesJointes/{id}/image-base64` : Récupération d'image en base64

**UsersController (api/Users) :**
- Gestion complète des utilisateurs : CRUD, activation/désactivation, changement de mot de passe, recherche par email, assignation de catégorie

**NotificationsController (api/Notifications) :**
- Consultation, marquage comme lu, suppression, compteur de notifications non lues

**III.2 Couche métier**

La couche métier implémente les règles de gestion pour chaque domaine :

**User.cs :**
- Vérification du mot de passe avec BCrypt
- Récupération des informations utilisateur
- Gestion du profil et du mot de passe

**Courrier.cs :**
- Création avec validation des champs obligatoires (référence, date, objet, catégorie)
- Mise à jour avec vérification des droits d'accès
- Changement de statut avec enregistrement automatique dans l'historique
- Réassignation avec notification à l'utilisateur cible
- Archivage logique

**PieceJointe.cs :**
- Upload et stockage des fichiers dans un répertoire dédié
- Validation des types de fichiers acceptés
- Gestion des associations avec les courriers
- Intégration avec le pipeline OCR

**Notification.cs :**
- Création de notifications lors d'événements clés (assignation, changement de statut)
- Gestion des catégories de notifications par rôle

**III.3 Couche d'accès aux données**

Cette couche utilise Npgsql pour exécuter des requêtes SQL paramétrées et des appels aux procédures stockées. La classe clsSeting.cs centralise la configuration de la connexion à la base de données.

Chaque classe Data expose des méthodes CRUD et des requêtes spécifiques :
- UsersData : 12 méthodes (getAll, getById, getByEmail, create, update, delete, activate, deactivate, changePassword, searchByEmail, assignCategory, getSummary)
- CourrierData : 15 méthodes (getAll, getById, create, update, delete, search, getByAssignedUser, getByAuthor, getIncoming, getOutgoing, getHistorique, reassign, getLecteurCourriers, changeStatus)
- NotificationData : 8 méthodes (getByUser, create, markAsRead, markAllAsRead, delete, getUnreadCount, getLecteurNotifications, getSuperAgentNotifications)

**III.4 Authentification et autorisation**

Le système d'authentification est basé sur JWT (JSON Web Token) avec les caractéristiques suivantes :

**Génération du token :**
- Algorithme : HMAC-SHA256
- Clé secrète : "THIS_IS_A_VERY_SECRET_KEY_123456"
- Claims inclus : NameIdentifier (ID utilisateur), Name (nom complet), Email, Role
- Émetteur (Issuer) : "BureauOrderArchiveAPI"
- Audience : "BureauOrderArchiveAPIUsers"
- Expiration : 30 minutes

**Validation du token :**
- Validation de l'émetteur, de l'audience, de la durée de vie et de la clé de signature
- Middleware ASP.NET Core appliqué globalement

**Politiques d'autorisation :**
- Contrôle d'accès basé sur les rôles avec `[Authorize(Roles = "Admin")]`
- Politiques personnalisées : "UserOwnerOrAdmin" (l'utilisateur accède à ses propres données ou est Admin), "CourrierOwnerOrAdmin" (l'utilisateur est l'auteur ou l'assigné du courrier ou est Admin)

**III.5 Pipeline OCR et classification**

Le pipeline de traitement OCR et classification se déroule en 6 étapes :

**Étape 1 : Acquisition de l'image**
- L'utilisateur capture une image via la caméra ou sélectionne un fichier depuis la galerie
- Les formats supportés : PNG, JPEG, BMP, TIFF
- L'image est téléchargée vers le serveur via l'endpoint d'upload

**Étape 2 : Extraction OCR (TesseractOcrService)**
- Validation que le fichier est un format image supporté
- Chargement des données de langue (français + anglais, optionnellement arabe)
- Traitement de l'image avec Tesseract à 300 DPI
- Retour du texte extrait et du score de confiance (0-100%)

**Étape 3 : Classification automatique (RuleBasedOcrClassificationService)**
- Normalisation du texte (minuscules, suppression des accents)
- Correspondance par mots-clés contre 8 catégories prédéfinies :
  1. Ressources Humaines (congé, absence, employé, salaire, recrutement, etc.)
  2. Financier (budget, facture, paiement, devis, virement, etc.)
  3. Juridique (contrat, plainte, contentieux, tribunal, etc.)
  4. Technique (maintenance, informatique, système, etc.)
  5. Administratif (dossier, demande, autorisation, circulaire, etc.)
  6. Archives (archivage, stockage, classement, etc.)
  7. Externe (partenaire, client, fournisseur, etc.)
  8. Interne (note interne, département, etc.)
- Calcul du score : `min(95, 50 + bestScore * 15)`
- Sélection de la catégorie avec le meilleur score

**Étape 4 : Prévisualisation (optionnelle)**
- L'utilisateur peut prévisualiser le texte extrait et la classification proposée
- Possibilité de modifier le texte manuellement

**Étape 5 : Confirmation**
- Enregistrement des résultats OCR dans la table ocr_resultat
- Enregistrement de la classification dans la table classification
- Mise à jour du champ texte_ocr du courrier
- Mise à jour de la catégorie du courrier si validée

**Étape 6 : Recherche**
- Le texte OCR devient consultable et intégrable dans les recherches plein texte

**IV. Implémentation du frontend**

**IV.1 Structure du projet**

Le projet frontend est organisé selon la structure suivante :

```
app/
├── app/                    # Point d'entrée Expo Router
│   └── index.tsx           # Composant racine
├── src/
│   ├── application/        # Coeur de l'application
│   │   ├── app.tsx         # Composant App avec providers
│   │   ├── providers/      # AppProvider, AuthProvider, ThemeProvider
│   │   └── routes/         # Navigateurs par rôle
│   ├── core/               # Infrastructure partagée
│   │   ├── di/             # Conteneur d'injection de dépendances
│   │   ├── network/        # Client Axios, configuration URL, endpoints
│   │   ├── storage/        # Gestion AsyncStorage (jetons)
│   │   └── utils/          # Utilitaires
│   ├── modules/            # Modules fonctionnels
│   │   ├── auth/           # Authentification
│   │   ├── courrier/       # Gestion des courriers, OCR, classification
│   │   ├── dashboard/      # Tableaux de bord
│   │   ├── users/          # Gestion des utilisateurs
│   │   ├── notifications/  # Notifications
│   │   ├── profile/        # Profil utilisateur
│   │   ├── reports/        # Rapports statistiques
│   │   ├── settings/       # Paramètres
│   │   ├── documents/      # Gestion documentaire
│   │   └── archives/       # Archives
│   └── shared/             # Code partagé
│       ├── constants/      # Routes, rôles, permissions
│       ├── presentation/   # Composants partagés
│       └── authorization/  # Gardes d'autorisation
```

**IV.2 Composants et écrans**

L'interface utilisateur est composée de plusieurs écrans organisés par module :

**Écrans d'authentification :**
- LoginScreen : Formulaire de connexion avec email et mot de passe. Gère les états de chargement et d'erreur, stocke le token JWT dans AsyncStorage.

**Écrans du tableau de bord :**
- AdminDashboardScreen : Statistiques globales (nombre de courriers, répartition par type, activité récente).
- AgentDashboardScreen : Aperçu personnalisé (courriers assignés, résultats OCR récents, statistiques).
- LecteurDashboardScreen : Courriers récents par catégorie, notifications, activités.

**Écrans de gestion des courriers :**
- CourrierOverviewScreen : Liste des courriers avec onglets (Entrant, Sortant, Tous), barre de recherche, filtres (statut, catégorie, expéditeur), tri par date.
- CourrierDetailScreen : Détail complet d'un courrier avec en-tête, informations, pièces jointes, texte OCR, historique, actions (modifier, archiver, réassigner, changer statut).
- CreateUpdateCourrierScreen : Formulaire de création/modification d'un courrier avec champs pour la référence, le type, la date, l'expéditeur/destinataire, l'objet, la description, la catégorie, l'assignation, la date d'échéance, et les pièces jointes.
- AgentIncomingMailScreen : Liste des courriers entrants filtrée pour l'Agent.
- AgentOutgoingMailScreen : Liste des courriers sortants filtrée pour l'Agent.

**Écran OCR et classification :**
- OCR Result : Prévisualisation du texte OCR extrait avec possibilité de correction manuelle.
- Classification : Proposition de catégorie avec score de confiance, catégories alternatives, et sélection manuelle.

**Écran de notifications :**
- NotificationsScreen : Liste des notifications avec indicateur de lecture, compteur non lu, marquage comme lu.

**Écrans de gestion des utilisateurs (Admin) :**
- UsersListScreen : Liste des utilisateurs avec recherche, activation/désactivation.
- UserDetailsScreen : Détail d'un utilisateur avec possibilité de modifier.
- CreateUpdateUserScreen : Formulaire de création/modification d'utilisateur.

**Écrans partagés :**
- ProfileScreen : Profil de l'utilisateur connecté.
- SettingsScreen : Paramètres système (Admin).
- ReportsScreen : Rapports statistiques avec sélection de période.
- ChangePasswordScreen : Changement de mot de passe.

**IV.3 Gestion d'état et navigation**

**Navigation :**
La navigation est gérée par React Navigation avec une structure hiérarchique :

```
RootNavigator (basé sur le rôle)
├── AuthStack (non authentifié)
│   └── LoginScreen
├── AdminStack (rôle Admin)
│   ├── AdminDashboard
│   ├── UsersList → UserDetails / CreateUpdateUser
│   ├── CourrierOverview → CourrierDetail → CreateUpdateCourrier
│   ├── Reports
│   ├── Settings
│   └── Notifications
├── AgentStack (rôle Agent / SuperAgent)
│   ├── AgentDashboard
│   ├── IncomingMail → CourrierDetail → CreateUpdateCourrier
│   ├── OutgoingMail → CourrierDetail → CreateUpdateCourrier
│   ├── Profile
│   ├── Notifications
│   └── OcrResults
└── LecteurStack (rôle Lecteur)
    ├── LecteurDashboard
    ├── CourrierOverview → CourrierDetail
    ├── Notifications
    └── Profile
```

**Gestion d'état :**
L'état de l'application est géré via :
- **Context API** : AuthProvider (session utilisateur), ThemeProvider (thème clair/sombre)
- **Hooks personnalisés** : Chaque fonctionnalité expose des hooks (useCourriers, useAuthSession, useNotifications, etc.) qui encapsulent la logique d'appel aux use cases et la gestion des états de chargement/erreur
- **Stockage local** : AsyncStorage pour la persistance du token JWT

**IV.4 Communication avec l'API**

La communication entre le frontend et le backend se fait via Axios, un client HTTP basé sur les promesses. Le module apiClient.ts configure :

1. **URL de base** : `http://localhost:5151/api` (configurable via variable d'environnement EXPO_PUBLIC_API_URL)
2. **Intercepteur de requête** : Ajoute automatiquement le token JWT dans l'en-tête Authorization
3. **Gestion des FormData** : Détection et configuration appropriée pour les uploads de fichiers
4. **Timeout** : 30 secondes pour éviter les requêtes bloquantes
5. **Méthodes exposées** : get, post, put, delete, postFormData

Les endpoints API sont centralisés dans un fichier endpoints.ts qui fournit des constantes typées pour toutes les routes, garantissant la cohérence et facilitant la maintenance.

**IV.5 Tests et validation**

La validation des formulaires est effectuée côté client avant soumission :
- Champs obligatoires : référence, date, objet, catégorie
- Validation spécifique : expéditeur requis pour les courriers entrants, destinataire pour les sortants
- Validation des dates : date d'échéance doit être postérieure à la date du courrier
- La gestion des erreurs API est centralisée avec affichage de messages appropriés

**V. Déploiement**

**V.1 Environnement de développement**

L'environnement de développement comprend :
- Backend : Lancement via Visual Studio ou `dotnet run` sur le port 5151
- Frontend : Lancement via `npx expo start` avec les options web, Android ou iOS
- Base de données : PostgreSQL 15 en local ou via Docker

**V.2 Docker et conteneurisation**

Le projet inclut une configuration Docker Compose pour faciliter le déploiement :

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: sa123456
      POSTGRES_DB: order_management_archive
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    environment:
      ConnectionString: "Host=postgres;Port=5432;Database=order_management_archive;Username=postgres;Password=sa123456"
    ports:
      - "5000:80"
    depends_on:
      - postgres
```

Cette configuration permet de déployer l'ensemble de la stack (base de données + API) avec une seule commande `docker-compose up`.

**V.3 Procédure de déploiement**

**Pour le backend :**
1. Cloner le dépôt Git
2. Configurer la chaîne de connexion dans `appsettings.json` ou via variable d'environnement
3. Exécuter `dotnet build` puis `dotnet run` ou utiliser Docker

**Pour le frontend :**
1. Naviguer vers `frontend/app/`
2. Exécuter `npm install`
3. Configurer `EXPO_PUBLIC_API_URL` dans le fichier `.env`
4. Exécuter `npx expo start`
5. Scanner le QR code avec Expo Go ou lancer sur un émulateur

**VI. Conclusion**

Ce second chapitre a présenté l'ensemble des aspects techniques liés à la conception et la réalisation du système. Nous avons détaillé l'architecture globale client-serveur, l'organisation en couches du backend, et la Clean Architecture modulaire du frontend.

La conception de la base de données a abouti à un schéma relationnel comprenant 10 tables avec 21 procédures stockées garantissant l'intégrité et la performance des accès aux données. L'implémentation du backend a donné lieu à une API RESTful complète avec 8 contrôleurs exposant plus de 40 endpoints, une authentification JWT robuste, et un pipeline OCR intégré.

Le frontend mobile a été réalisé avec React Native et Expo, offrant une interface utilisateur intuitive et réactive avec 20 écrans répartis sur 4 rôles différents. L'architecture modulaire par fonctionnalité assure la maintenabilité et l'évolutivité du code.

L'intégration de Tesseract pour l'OCR et du système de classification par règles métier constitue la valeur ajoutée principale de notre projet, permettant une automatisation intelligente du traitement des documents administratifs.

---

**CONCLUSION GENERALE ET PERSPECTIVES**

Le présent projet de fin d'études nous a permis de concevoir et réaliser une application mobile intelligente pour la gestion du Bureau d'Ordre et des Archives. Ce travail, réalisé dans le cadre du module M365 de la Licence en Génie Informatique, nous a offert l'opportunité de mettre en pratique les connaissances acquises tout au long de notre formation et d'acquérir de nouvelles compétences techniques.

**Bilan du travail accompli :**

Nous avons développé une solution complète comprenant :
- Une API RESTful robuste construite avec ASP.NET Core, organisée en quatre couches (Présentation, Métier, Accès aux données, DTO) et sécurisée par authentification JWT
- Une base de données PostgreSQL optimisée avec 10 tables, 21 fonctions stockées et des mécanismes d'intégrité (triggers, contraintes)
- Une application mobile multiplateforme développée avec React Native et Expo, offrant une interface utilisateur intuitive et adaptée aux différents rôles (Administrateur, Agent, Super Agent, Lecteur)
- Un pipeline OCR intégré utilisant Tesseract pour l'extraction automatique de texte à partir de documents scannés
- Un système de classification automatique basé sur des règles métier pour catégoriser les documents

**Résultats et réalisations :**

L'application répond aux objectifs fixés initialement :
- Dématérialisation complète du processus de gestion du courrier
- Automatisation de la saisie via OCR, réduisant les erreurs humaines et le temps de traitement
- Traçabilité totale avec historique des statuts et notifications en temps réel
- Collaboration efficace entre les acteurs via les fonctionnalités d'assignation
- Classification intelligente des documents facilitant leur traitement et leur recherche
- Accessibilité mobile permettant la gestion à distance

**Compétences développées :**

Ce projet nous a permis de développer et renforcer des compétences dans plusieurs domaines :
- **Développement mobile** : React Native, Expo, gestion de la navigation, composants personnalisés
- **Développement backend** : ASP.NET Core, architecture en couches, API RESTful, JWT
- **Base de données** : PostgreSQL, conception de schémas relationnels, procédures stockées
- **Architecture logicielle** : Clean Architecture, principes SOLID, patterns de conception
- **Traitement d'images** : OCR avec Tesseract, prétraitement d'images
- **Conteneurisation** : Docker, Docker Compose
- **Gestion de projet** : Organisation du travail, respect des délais, documentation

**Perspectives d'amélioration :**

Bien que l'application soit fonctionnelle et réponde aux besoins identifiés, plusieurs perspectives d'amélioration peuvent être envisagées :

1. **Intelligence artificielle avancée** : Remplacer la classification par règles par un modèle de Machine Learning entraîné sur un corpus de documents réels pour une meilleure précision. Intégrer un modèle de vision par ordinateur pour la reconnaissance de formulaires structurés.

2. **Signature électronique** : Ajouter la possibilité de signer électroniquement les documents, renforçant ainsi la validité juridique des transactions.

3. **Mode hors ligne** : Permettre le fonctionnement de l'application en mode déconnecté avec synchronisation automatique lors du retour en ligne, utile dans les zones à connectivité limitée.

4. **Tableau de bord avancé** : Enrichir les tableaux de bord avec des graphiques interactifs, des indicateurs de performance clés (KPI) et des fonctionnalités d'export de rapports (PDF, Excel).

5. **Intégration avec d'autres systèmes** : Connecter l'application avec les systèmes d'information existants (SIEL, GED, etc.) via des API standardisées.

6. **Notifications push** : Remplacer les notifications in-app par des notifications push natives pour une meilleure expérience utilisateur.

7. **Version web progressive** : Développer une version PWA (Progressive Web App) complémentaire pour les postes de travail fixes.

8. **Multilinguisme** : Étendre le support linguistique au-delà du français, en incluant l'arabe et éventuellement l'anglais dans l'interface et l'OCR.

**Conclusion :**

En conclusion, ce projet nous a permis de réaliser une application complète et fonctionnelle qui répond aux besoins de gestion moderne du courrier administratif. Au-delà de l'aspect technique, cette expérience nous a offert une immersion réaliste dans le cycle de vie d'un projet informatique, de l'analyse des besoins au déploiement, en passant par la conception, l'implémentation et les tests. Les compétences acquises et les défis relevés constituent une base solide pour notre future carrière professionnelle dans le domaine du génie informatique.

---

**BIBLIOGRAPHIE**

**[1]** MICROSOFT, "ASP.NET Core Documentation", Microsoft Learn, https://learn.microsoft.com/en-us/aspnet/core , 2025.

**[2]** META, "React Native Documentation", https://reactnative.dev/docs/getting-started , 2025.

**[3]** EXPO, "Expo SDK Documentation", https://docs.expo.dev/ , 2025.

**[4]** REACT NAVIGATION, "React Navigation Documentation", https://reactnavigation.org/docs/getting-started , 2025.

**[5]** SMITH, R., "Tesseract OCR: An Open-Source Optical Character Recognition Engine", Linux Journal, Volume 2007, Issue 159, Page 2, July 2007.

**[6]** FOWLER, M., "Patterns of Enterprise Application Architecture", Addison-Wesley Professional, 2002, ISBN 978-0321127426.

**[7]** MARTIN, R.C., "Clean Architecture: A Craftsman's Guide to Software Structure and Design", Prentice Hall, 2017, ISBN 978-0134494166.

**[8]** AXIOS, "Axios HTTP Client Documentation", https://axios-http.com/docs/intro , 2025.

**[9]** POSTGRESQL GLOBAL DEVELOPMENT GROUP, "PostgreSQL Documentation", https://www.postgresql.org/docs/ , 2025.

**[10]** GARDARIN, G., "Bases de données", Éditions Eyrolles, 2003, ISBN 978-2212117118.

**[11]** BOOCH, G., RUMBAUGH, J., JACOBSON, I., "The Unified Modeling Language User Guide", 2nd Edition, Addison-Wesley Professional, 2005, ISBN 978-0321267979.

**[12]** NEWMAN, S., "Building Microservices: Designing Fine-Grained Systems", O'Reilly Media, 2015, ISBN 978-1491950357.

**[13]** RESHAT, LLC, "BCrypt.Net-Next", https://github.com/BcryptNet/bcrypt.net , 2025.

**[14]** Npgsql Development Team, "Npgsql: .NET Data Provider for PostgreSQL", https://www.npgsql.org/doc/index.html , 2025.

**[15]** TAILWIND LABS, "NativeWind Documentation", https://www.nativewind.dev/ , 2025.

---

**ANNEXE A**

Diagramme de cas d'utilisation général du système

(Figure illustrant les cas d'utilisation avec les acteurs : Administrateur, Agent, Super Agent, Lecteur)

**ANNEXE B**

Diagramme de classes du domaine Courrier

(Figure illustrant les classes Utilisateur, CourrierEntrant, CourrierSortant, PieceJointe, OcrResultat, Classification, Notification, HistoriqueStatut et leurs relations)

**ANNEXE C**

Schéma entité-relation de la base de données

(Figure illustrant les 10 tables avec leurs colonnes, clés primaires, clés étrangères et relations)

**ANNEXE D**

Structure complète des endpoints de l'API REST

(Tableau complet listant tous les endpoints avec méthodes HTTP, routes, paramètres et descriptions)
