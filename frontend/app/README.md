# Bureau d'Ordre Intelligent — Mobile App

React Native (Expo) mobile application for managing incoming and outgoing correspondence (courrier), with OCR document scanning, classification, and archiving workflows.

Built with **Expo SDK 54**, **React Native 0.81**, **React Navigation 7**, **NativeWind**, and **TypeScript**.

## Features

- **Authentication** — JWT-based login with role-based access (Admin, Super Agent, Agent, Lecteur)
- **Dashboard** — Role-specific dashboards with stats, recent activity, and OCR results
- **Courrier Management** — Create, update, view, reassign, and archive incoming/outgoing mail
- **OCR Scanning** — Capture or upload document images, extract text via Tesseract OCR, preview and confirm results
- **Classification** — Rule-based automatic categorization with confidence scoring
- **Attachments** — Upload and preview document attachments (images, PDFs)
- **Notifications** — Real-time alerts for status changes and assignments
- **Filters & Search** — Filter by status, category, date, sender; sort and search across courriers
- **User Management** — Admin panel for creating, editing, and managing users

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | React Navigation 7 (native-stack) |
| Styling | NativeWind 4 (Tailwind CSS for RN) |
| HTTP Client | Axios with interceptors |
| Storage | AsyncStorage (JWT tokens) |
| Image Picking | expo-image-picker / expo-document-picker |
| Camera | expo-camera |
| Date Picker | @react-native-community/datetimepicker |
| Icons | @expo/vector-icons (Feather, Ionicons) |
| Linting | ESLint (expo-config) |
| Language | TypeScript ~5.9 |

## Project Structure

```
app/
├── app/                    # Expo Router entry point
│   └── index.tsx           # App entry (renders <App />)
├── src/
│   ├── application/        # App shell, providers, routing
│   │   ├── app.tsx
│   │   ├── providers/      # ThemeProvider, AuthProvider, AppProvider
│   │   └── routes/         # Stack navigators (Admin, Agent, Lecteur)
│   ├── core/               # Shared infrastructure
│   │   ├── di/             # Dependency injection container
│   │   ├── network/        # Axios client, endpoints, interceptors
│   │   ├── storage/        # AsyncStorage token management
│   │   └── utils/          # Shared utilities
│   ├── modules/            # Feature modules (clean architecture)
│   │   ├── auth/           # Authentication (login, session)
│   │   ├── courrier/       # Courrier CRUD, OCR, classification
│   │   ├── dashboard/      # Role-specific dashboards
│   │   ├── users/          # User management (admin)
│   │   ├── notifications/  # Push/in-app notifications
│   │   ├── profile/        # User profile screen
│   │   ├── reports/        # Statistics and analytics
│   │   ├── settings/       # App settings
│   │   ├── documents/      # Document viewer (placeholder)
│   │   └── archives/       # Archive screen (placeholder)
│   └── shared/             # Cross-module shared code
│       ├── constants/      # Routes, roles, permissions
│       ├── presentation/   # Shared components, hooks, screens
│       └── authorization/  # Permission/role guards
├── assets/                 # Images, fonts, icons
├── app.json                # Expo configuration
├── tsconfig.json           # TypeScript configuration
├── package.json
└── .env                    # Environment variables (local)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- [Expo Go](https://expo.dev/go) on your phone (optional, for physical device testing)

### Installation

```bash
npm install
```

### Run the App

```bash
npx expo start
```

Then press:
- `a` — Open on Android emulator
- `i` — Open on iOS simulator
- `w` — Open in web browser
- Scan QR code — Open in **Expo Go** on your phone

### Environment Variables

Create a `.env` file in the project root:

```env
# Required for physical device testing (replace with your machine's local IP)
EXPO_PUBLIC_API_URL=http://192.168.x.x:5151/api
```

If not set, the app defaults to `http://localhost:5151/api` (works on emulators and web browser).

### Backend

This app requires the backend API running on port `5151`. See the `Backend/` directory for setup instructions.

## Architecture

Each feature module follows **clean architecture** principles:

```
modules/<feature>/
├── domain/
│   ├── entities/          # Business models
│   ├── repositories/      # Repository interfaces (contracts)
│   └── usecases/          # Business logic / use cases
├── data/
│   ├── datasources/       # Remote/local data sources (API calls)
│   ├── models/            # Data transfer objects (API responses)
│   ├── mappers/           # Model <-> Entity mapping
│   └── repositories/      # Repository implementations
└── presentation/
    ├── components/        # Reusable UI components
    ├── hooks/             # Custom hooks (state + use case orchestration)
    └── screens/           # Full-screen views
```

Dependency injection is handled via a simple manual DI container (`src/core/di/container.ts`).

## Roles

| Role | Permissions |
|---|---|
| **Admin** | Full access: manage users, all courriers, system settings |
| **Super Agent** | Create/edit courriers, OCR, classification, reassign |
| **Agent** | Create/edit own courriers, OCR, view assigned |
| **Lecteur** | Read-only: view courriers, dashboard, notifications |

## Build & Deploy

```bash
# Android APK
npx expo run:android

# iOS IPA
npx expo run:ios

# Web build
npx expo export --platform web
```
