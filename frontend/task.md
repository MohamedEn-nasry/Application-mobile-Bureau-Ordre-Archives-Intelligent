# System Settings Page Implementation

## Overview
Implement a comprehensive System Settings page based on the provided UI designs. The settings page will include multiple sections for OCR & AI Classification, Backup & Archiving, and System Information configurations.

## Files to Create

### 1. Settings Module Structure
- `frontend/app/src/modules/settings/presentation/screens/SettingsScreen.tsx` - Main settings screen component
- `frontend/app/src/modules/settings/presentation/components/SettingsSection.tsx` - Reusable section component
- `frontend/app/src/modules/settings/presentation/components/SettingItem.tsx` - Individual setting item component
- `frontend/app/src/modules/settings/presentation/components/SettingToggle.tsx` - Toggle switch component
- `frontend/app/src/modules/settings/presentation/components/SettingSelector.tsx` - Selector/dropdown component

### 2. Domain Layer
- `frontend/app/src/modules/settings/domain/entities/Settings.ts` - Settings entity types
- `frontend/app/src/modules/settings/domain/repositories/ISettingsRepository.ts` - Repository interface
- `frontend/app/src/modules/settings/domain/usecases/GetSettingsUseCase.ts` - Get settings use case
- `frontend/app/src/modules/settings/domain/usecases/UpdateSettingsUseCase.ts` - Update settings use case

### 3. Data Layer
- `frontend/app/src/modules/settings/data/datasources/SettingsApiDataSource.ts` - API data source
- `frontend/app/src/modules/settings/data/repositories/SettingsRepositoryImpl.ts` - Repository implementation
- `frontend/app/src/modules/settings/data/mappers/SettingsMapper.ts` - Data mapping utilities

### 4. Hooks
- `frontend/app/src/modules/settings/presentation/hooks/useSettings.ts` - Main settings hook
- `frontend/app/src/modules/settings/presentation/hooks/useUpdateSettings.ts` - Update settings hook

### 5. Styles
- `frontend/app/src/modules/settings/presentation/styles/SettingsStyles.ts` - Stylesheet constants

## Files to Use/Modify

### 1. Navigation
- `frontend/app/src/shared/constants/routes.ts` - Add settings route constants
- `frontend/app/src/shared/presentation/components/BottomNav.tsx` - Add settings navigation item

### 2. App Structure
- `frontend/app/src/App.tsx` - Add settings route to navigation

### 3. API Integration
- `frontend/app/src/shared/api/client.ts` - Add settings API endpoints

### 4. State Management
- `frontend/app/src/shared/store/` - Add settings state management if needed

## Settings Features to Implement

### 1. OCR & AI Classification Section
- OCR Language selector (Arabe + Français)
- Confidence Threshold slider (80%)
- OCR Activated toggle
- Automatic Classification toggle

### 2. Backup & Archiving Section
- Automatic Backup toggle
- Backup Frequency selector (Quotidienne)
- Automatic Archiving toggle
- Launch Backup Now button

### 3. System Information Section
- Server information display (Ubuntu 22.04)
- Database information (PostgreSQL 15)
- Last backup status (Hier 02:00)
- Update status (À jour)

### 4. Save Functionality
- Save Settings button with validation
- Success/error feedback
- Loading states during save operations

## Technical Requirements

### UI Components
- Toggle switches for boolean settings
- Selectors/dropdowns for multiple choice settings
- Information displays for system status
- Section headers with proper styling
- Responsive design for mobile screens

### Data Management
- Fetch current settings from API
- Update settings via API calls
- Handle loading and error states
- Form validation before saving
- Success feedback after save

### Navigation
- Integrate with existing bottom navigation
- Proper route handling
- Screen transitions

## Acceptance Criteria
- Settings page displays all sections correctly
- All toggles and selectors are functional
- Settings can be updated and saved successfully
- Proper loading states and error handling
- Integration with existing navigation system
- Responsive design matches provided UI mockups