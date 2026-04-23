# Intelligent Bureau d'Ordre — v2.0

Application mobile React Native / Expo de gestion intelligente du courrier administratif avec fonctionnalités IA.

---

## Identifiants de démonstration

| Rôle    | Email                    | Mot de passe  |
|---------|--------------------------|---------------|
| Admin   | `a.mehdi@bureau.dz`      | `Admin123!`   |
| Agent   | `s.benali@bureau.dz`     | `Agent123!`   |
| Lecteur | `l.hamdi@bureau.dz`      | `Lecteur123!` |

---

## Installation rapide

```bash
# 1. Installer les dépendances
cd BureauDordre
npm install

# 2. Démarrer le serveur de développement
npx expo start

# 3. Lancer sur Android
npx expo start --android

# 4. Lancer sur iOS
npx expo start --ios
```

Scannez le QR code avec **Expo Go** sur votre téléphone, ou appuyez sur `a` pour l'émulateur Android.

---

## Architecture du projet

```
BureauDordre/
├── App.js                              # Point d'entrée
├── app.json                            # Configuration Expo
├── babel.config.js
├── package.json
└── src/
    ├── context/
    │   └── AuthContext.js              # Gestion de la session
    ├── data/
    │   └── mockData.js                 # Données de démo
    ├── navigation/
    │   ├── RootNavigator.js            # Routage par rôle
    │   ├── AdminNavigator.js           # Onglets + piles Admin
    │   ├── AgentNavigator.js           # Onglets + piles Agent
    │   └── LecteurNavigator.js         # Onglets + piles Lecteur
    ├── components/
    │   └── index.js                    # 20+ composants réutilisables
    ├── theme/
    │   └── index.js                    # Couleurs, typo, espacements
    └── screens/
        ├── shared/
        │   └── LoginScreen.js          # Connexion (tous rôles)
        ├── admin/                      # 13 écrans Admin
        │   ├── AdminDashboard.js
        │   ├── AdminMailScreen.js
        │   ├── AdminMailDetailScreen.js
        │   ├── AdminOutgoingDetailScreen.js   ← NOUVEAU
        │   ├── AdminMailHistoryScreen.js      ← NOUVEAU
        │   ├── AdminUsersScreen.js
        │   ├── AdminCreateUserScreen.js
        │   ├── AdminEditUserScreen.js
        │   ├── AdminRolesScreen.js
        │   ├── AdminNotificationsScreen.js
        │   ├── AdminReportsScreen.js
        │   ├── AdminSettingsScreen.js
        │   └── AdminProfileScreen.js
        ├── agent/                      # 12 écrans Agent
        │   ├── AgentDashboard.js
        │   ├── AgentIncomingScreen.js
        │   ├── AgentAddIncomingScreen.js
        │   ├── AgentIncomingDetailScreen.js
        │   ├── AgentOutgoingScreen.js
        │   ├── AgentAddOutgoingScreen.js
        │   ├── AgentOutgoingDetailScreen.js
        │   ├── AgentScanScreen.js
        │   ├── AgentOCRScreen.js
        │   ├── AgentClassificationScreen.js
        │   ├── AgentNotificationsScreen.js
        │   └── AgentProfileScreen.js
        └── lecteur/                    # 8 écrans Lecteur
            ├── LecteurDashboard.js
            ├── LecteurMailScreen.js
            ├── LecteurMailDetailScreen.js
            ├── LecteurDocumentViewerScreen.js
            ├── LecteurSearchScreen.js          ← filtres appliqués + historique
            ├── LecteurArchiveScreen.js
            ├── LecteurNotificationsScreen.js
            └── LecteurProfileScreen.js
```

---

## Rôles et accès

| Fonctionnalité                    | Admin | Agent | Lecteur |
|-----------------------------------|:-----:|:-----:|:-------:|
| Tableau de bord analytique        | ✅    | ✅    | ✅      |
| Voir tout le courrier             | ✅    | ✅    | ✅      |
| Créer / modifier le courrier      | ✅    | ✅    | ❌      |
| Scanner des documents             | ✅    | ✅    | ❌      |
| Lancer l'OCR                      | ✅    | ✅    | ❌      |
| Appliquer la classification IA    | ✅    | ✅    | ❌      |
| Mettre à jour les statuts         | ✅    | ✅    | ❌      |
| Gérer les utilisateurs            | ✅    | ❌    | ❌      |
| Attribuer les rôles               | ✅    | ❌    | ❌      |
| Paramètres système                | ✅    | ❌    | ❌      |
| Rapports et analytique            | ✅    | ❌    | ❌      |
| Rechercher et filtrer             | ✅    | ✅    | ✅      |
| Consulter les archives            | ✅    | ✅    | ✅      |

---

## Composants disponibles

`Badge` `Card` `StatCard` `Input` `SelectInput` `PrimaryButton` `SecondaryButton`
`IconButton` `SearchBar` `FilterChips` `SectionTitle` `InfoRow` `ScreenHeader`
`AppBar` `NotifCard` `MailCard` `Avatar` `Toggle` `OCRBox` `AICard`
`AttachmentItem` `Timeline` `QuickActionButton` `ReadOnlyBanner` `EmptyState`
`SettingsRow` `UserRow` `ActionBar`

---

## Intégration backend (prochaines étapes)

1. Remplacer `src/data/mockData.js` par des appels API (REST / GraphQL)
2. Implémenter l'authentification JWT dans `AuthContext.js`
3. Connecter `expo-camera` pour la numérisation réelle dans `AgentScanScreen`
4. Intégrer un service OCR (Google Vision API, Tesseract.js) dans `AgentOCRScreen`
5. Connecter un moteur de classification IA dans `AgentClassificationScreen`
6. Ajouter les notifications push via `expo-notifications`
7. Implémenter l'upload/download de fichiers avec `expo-document-picker`
