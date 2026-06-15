# 📁 Smart Mail Room & Intelligent Archiving Mobile Application 🚀
> **AI-Powered Mobile Application for Enterprise Mail Management (Bureau d'Ordre) and Digital Archiving.**

---

<p align="center">
  <img src="https://img.shields.io/badge/Clean_Architecture-Applied-blue?style=for-the-badge&logo=react" alt="Clean Architecture">
  <img src="https://img.shields.io/badge/.NET_8.0_Web_API-Backend-purple?style=for-the-badge&logo=.net" alt=".NET 8">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Expo_React_Native-Frontend-darkgreen?style=for-the-badge&logo=expo" alt="React Native Expo">
  <img src="https://img.shields.io/badge/AI_Powered-OCR_Tesseract-red?style=for-the-badge" alt="AI Powered OCR">
</p>

---

## 🎯 Project Overview

This repository hosts a state-of-the-art **Smart Mail Room & Intelligent Archiving System (Bureau d'Ordre & Archives Intelligent)** designed for modern administrative offices. The solution is built with a decoupled, high-performance architecture consisting of a **.NET 8.0 Web API** backend connected to a robust **PostgreSQL** database, and a highly responsive, modern mobile application built with **React Native Expo** and **TypeScript**.

The system enables administrative personnel to digitize physical mail directly via their smartphone camera, automatically extract text from image attachments using **Tesseract OCR** (supporting Arabic, French, and English), and automatically categorize documents into administrative departments using an intelligent, rule-based keyword matching algorithm.

---

## 📚 Technical Documentation

A comprehensive, low-level technical guide has been prepared to cover all facets of the application's design, database schema, AI pipelines, and security modules.

> [!IMPORTANT]
> 📖 **Click the link below to access the full technical documentation:**
> 👉 **[Smart Mail Room - Complete Technical Documentation (DOCUMENTATION.md)](file:///d:/PFE/Application-mobile-Bureau-Ordre-Archives-Intelligent/DOCUMENTATION.md)**

---

## ✨ Key System Features

### 💻 Backend Core (.NET 8.0)
* **Decoupled Layered Architecture:** Organized into Presentation, Business Logic, DTO, and Data Access layers for absolute separation of concerns.
* **Stored Procedures & Triggers:** Highly secure and performant database access using raw **Npgsql (ADO.NET)** connections to invoke PostgreSQL Stored Procedures, preventing SQL injection and maximizing query speeds.
* **Custom Security Policies (RBAC):** Strict resource ownership verification (`UserOwnerOrAdminHandler` and `CourrierOwnerOrAdminHandler`) protecting personal user records and mail logs from unauthorized queries.
* **AI OCR & Categorization Pipelines:**
  * Multi-language document parsing utilizing Tesseract OCR.
  * Keyword mapping model providing explainable AI category suggestions and dynamic confidence scores.

### 📱 Mobile Application (React Native Expo)
* **Domain-Driven Clean Architecture:** Fully modular directory structure separating core domain logic (Use Cases, Models) from presentation views and data sources.
* **Manual Dependency Injection Container:** A dedicated singleton service locator (`DIContainer.ts`) that manages class dependencies, facilitating testing and decoupling features.
* **Modern UI/UX Design:** Designed with NativeWind (Tailwind CSS for React Native) for dynamic page transitions, modern layouts, and real-time status notifications.

---

## 🗂️ Workspace Directory Structure

```markdown
├── 📁 Backend/                     # Backend API & Database Files
│   ├── 📁 Presentation/            # API Controllers, JWT, OCR and Classification services
│   ├── 📁 Business Layer/          # Core Business rules and workflow validations
│   ├── 📁 Data Access/             # Low-level PostgreSQL Npgsql connection & Stored Procedures
│   └── 📁 DTO/                     # Decoupled Data Transfer Objects
├── 📁 frontend/                    # Cross-platform Mobile Application
│   └── 📁 app/                     # React Native Expo project structure
│       ├── 📁 app/                 # Central navigation routes (Expo Router)
│       └── 📁 src/                 # Main Clean Architecture source directory
│           ├── 📁 application/     # App entry, global providers, and routes
│           ├── 📁 core/            # Manual DI container, storage, and Axios network client
│           ├── 📁 modules/         # Domain-driven feature modules (auth, courrier...)
│           └── 📁 shared/          # Global UI reusable components and widgets
├── 📁 Database/                    # Database Setup
│   └── 📄 backup.sql               # PostgreSQL Schema, Functions, Procedures and seed data
├── 📁 Conception/                  # Conceptual System Design Assets
│   ├── 📁 ERD/                     # Entity Relationship Diagrams (SVG & Draw.io)
│   ├── 📁 UML/                     # Use Case UML Diagrams
│   └── 📁 Diagramme d’architecture # High-level system architecture blueprints
└── 📄 DOCUMENTATION.md             # In-depth technical documentation in English 📖
```

---

## 🛠️ Quick Start Guide

1. **Database:** Import the schema and stored procedures from `Database/backup.sql` into your PostgreSQL instance.
2. **Backend API:** Verify your DB connection string in `clsSeting.cs` and run `dotnet run` inside the `Backend/Presentation` directory.
3. **Mobile App:** Go to `frontend/app`, run `npm install` to load dependencies, and run `npx expo start` to compile the app and run it on your mobile device via Expo Go.

*For precise steps on setting up system prerequisites, configuring Tesseract, or modifying JWT parameters, refer to the **[Installation & Configuration Guide in DOCUMENTATION.md](file:///d:/PFE/Application-mobile-Bureau-Ordre-Archives-Intelligent/DOCUMENTATION.md#7-deployment--installation-guide)**.*

---

<p align="center">
  <b>Designed and Engineered with Pride to Showcase Enterprise Development Best Practices in Graduation Projects (PFE) 🎓✨</b>
</p>
