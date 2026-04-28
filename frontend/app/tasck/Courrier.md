## Task : Manage Outgoing Courrier  

### Overview
Display, search, filter, and manage outgoing courrier with detailed views and actions.

### Files to Create

#### Domain Layer
- **`src/modules/courrier/domain/entities/OutgoingCourrier.ts`**
  - Interface for outgoing courrier data
  - Fields: recipient, subject, date, status, priority
  - Extend BaseEntity with courrier-specific properties

- **`src/modules/courrier/domain/entities/CourrierFilter.ts`**
  - Interface for search and filter criteria
  - Fields: date range, status, recipient, priority
  - Support for complex filtering logic

- **`src/modules/courrier/domain/repositories/IOutgoingCourrierRepository.ts`**
  - Interface for outgoing courrier operations
  - Methods: `getOutgoingCourrier(filter?: CourrierFilter)`, `getCourrierById(id: string)`

- **`src/modules/courrier/domain/usecases/GetOutgoingCourrierUseCase.ts`**
  - Business logic for fetching outgoing courrier list
  - Handle filtering and pagination

- **`src/modules/courrier/domain/usecases/GetCourrierDetailsUseCase.ts`**
  - Business logic for fetching specific courrier details
  - Include related documents and actions

#### Data Layer
- **`src/modules/courrier/data/datasources/OutgoingCourrierRemoteDataSource.ts`**
  - API integration for outgoing courrier endpoints
  - Handle search and filter parameters
  - Map DTOs to domain entities

- **`src/modules/courrier/data/repositories/OutgoingCourrierRepositoryImpl.ts`**
  - Concrete implementation of repository interface
  - Wrap API calls in Result pattern
  - Handle courrier-specific errors

#### Presentation Layer
- **`src/modules/courrier/presentation/screens/OutgoingCourrierListScreen.tsx`**
  - Main screen for outgoing courrier list
  - Search and filter functionality
  - List/grid view with pagination

- **`src/modules/courrier/presentation/screens/CourrierDetailsScreen.tsx`**
  - Screen for detailed courrier view
  - Document attachments, actions, timeline
  - Edit and status management

- **`src/modules/courrier/presentation/components/CourrierListItem.tsx`**
  - Reusable list item component
  - Status indicators, priority badges
  - Quick action buttons

- **`src/modules/courrier/presentation/components/CourrierFilterPanel.tsx`**
  - Component for search and filter UI
  - Date pickers, status selectors
  - Filter reset functionality

- **`src/modules/courrier/presentation/hooks/useOutgoingCourrier.ts`**
  - Custom hook for courrier list state management
  - Handle search, filter, and pagination
  - Integration with use cases

- **`src/modules/courrier/presentation/hooks/useCourrierDetails.ts`**
  - Custom hook for courrier details
  - Handle loading, error, and actions
  - Real-time updates if needed

### Files to Modify

#### Core Layer
- **`src/core/network/endpoints.ts`**
  - Add outgoing courrier endpoints
  - Add courrier search/filter endpoints
  - Add courrier details endpoints

#### Shared Layer
- **`src/shared/constants/routes.ts`**
  - Add courrier-related routes
  - Add `Routes.Admin.OutgoingCourrier` constants

#### Application Layer
- **`src/application/routes/AdminStack.tsx`**
  - Add courrier screens to navigation stack
  - Configure screen options and deep linking

#### Shared Components
- **`src/shared/presentation/components/BottomNav.tsx`**
  - Ensure courrier tab navigation works
  - Update routing if needed

### Dependencies
- Existing courrier management backend
- Document management system
- Search and filtering infrastructure
- File upload/download capabilities

---

## UI Design Specifications

### Mail Overview Screen
Purpose:
- Let the admin view all incoming and outgoing mail in one place

Include:
- Page title: Mail Overview
- Tabs:
  - Incoming
  - Outgoing
  - All
- Search bar
- Filters:
  - Date
  - Sender / Recipient
  - Subject
  - Status
  - Category
- Mail list cards showing:
  - Reference number
  - Sender or Recipient
  - Subject
  - Date
  - Status badge
- Quick sorting options
- Tap to open details

### Outgoing Mail Detail Screen (Admin View)
Purpose:
- Full read and control access over outgoing mail

Include:
- Reference
- Date sent
- Recipient
- Subject
- Description
- Attachments preview
- Status badge
- Action buttons:
  - Edit
  - Archive
  - Reassign
  - View History

### Design Style Requirements
- Clean, modern, professional
- Mobile-first Android UI
- Blue / indigo primary palette
- White or very light gray background
- Rounded cards and input fields
- Soft shadows
- Clear visual hierarchy
- Government / enterprise administrative app look
- Consistent spacing and reusable design components
- High readability and practical workflow

### Navigation Integration
- Bottom navigation with Mail tab
- Consistent with overall Admin flow
- Seamless integration with other screens

---