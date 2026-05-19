Design a complete modern Android mobile UI flow for the Lecteur role of an application called “Intelligent Bureau d’Ordre”, a smart administrative mail and document management system.

Important product rules:
- There is NO public sign-up
- User accounts are created and managed only by the Admin
- Regular users only log in with credentials assigned by the Admin
- Role-based access exists for Admin, Agent, and Lecteur
- The Lecteur role is read-only and is limited to consultation, search, filtering, and viewing document details

Design style:
- Clean, modern, professional
- Mobile-first Android UI
- Blue / indigo primary palette
- White or very light gray background
- Rounded cards and input fields
- Soft shadows
- Clear visual hierarchy
- Administrative / enterprise app design
- Consistent spacing and reusable design components
- Focus on readability and easy navigation

Create the following Lecteur screens as a cohesive design system:

1. Lecteur Login Screen
Purpose:
- Secure access for read-only users

Include:
- App logo
- App name: Intelligent Bureau d’Ordre
- Title: Welcome Back
- Subtitle: Sign in to access your workspace
- Input: Username or Email
- Input: Password
- Remember me checkbox
- Forgot password link
- Primary button: Log In

Important:
- Do NOT include Sign Up
- Do NOT include Create Account
- This app supports login only

2. Lecteur Dashboard Screen
Purpose:
- Simple overview screen for consultation users

Include:
- Top app bar with page title and notification icon
- Greeting header
- Search bar
- Summary or preview cards:
  - Recent Incoming Mail
  - Recent Outgoing Mail
  - Archived Documents
  - Notifications
- Sections:
  - Recent Documents
  - Latest Updates
  - Quick Access
- Quick actions:
  - Search Mail
  - View Documents
  - Open Archive
- Bottom navigation:
  - Dashboard
  - Mail
  - Notifications
  - Profile

The dashboard should feel simple, calm, and read-only.

3. Mail List Screen
Purpose:
- Allow the Lecteur to browse all accessible mail records in read-only mode

Include:
- Title: Mail
- Tabs:
  - Incoming
  - Outgoing
  - Archive
- Search bar
- Filter chips:
  - Date
  - Sender / Recipient
  - Subject
  - Status
  - Category
- List cards showing:
  - Reference number
  - Sender or Recipient
  - Subject
  - Date
  - Status badge
- Cards should open details only
- No add, edit, or delete actions

4. Mail Detail Screen
Purpose:
- Allow the Lecteur to consult full details of a mail item

Include:
- Reference
- Date
- Sender or Recipient
- Subject
- Description
- Attachments preview
- OCR extracted text section
- Classification / category section
- Status display
- Timeline or history preview if available

Important:
- Read-only layout
- No edit button
- No archive button
- No update status button

5. Document Viewer Screen
Purpose:
- Open attached files and scanned documents for consultation

Include:
- Title: Document Viewer
- Document preview area
- Page controls if PDF
- Zoom controls
- Download or open externally option if appropriate
- Search in document if available

6. Search Results Screen
Purpose:
- Show results after searching mail or documents

Include:
- Search field at top
- Applied filters row
- List of matching mail/document cards
- Empty state if no results
- Tap result to open details

7. Notifications Screen
Purpose:
- Show informative updates relevant to the Lecteur

Include:
- Tabs:
  - All
  - Updates
  - Reminders
- Notification cards:
  - new document available
  - status changed
  - archive updated
- Mark as read
- Tap to open related item

8. Archive Screen
Purpose:
- Let the Lecteur browse archived mail and documents

Include:
- Title: Archive
- Search bar
- Filter chips
- Archived item cards with:
  - Reference
  - Subject
  - Date archived
  - Category
- Open details action only

9. Lecteur Profile Screen
Purpose:
- Personal account area for the Lecteur

Include:
- Profile picture
- Name
- Email
- Role: Lecteur
- Change password
- Logout button

Navigation requirements:
- Keep consistent bottom navigation:
  - Dashboard
  - Mail
  - Notifications
  - Profile
- Keep navigation simple and uncluttered
- Reuse cards, search bars, filters, and detail layouts across screens

UX requirements:
- The Lecteur flow should feel simple, readable, and consultation-oriented
- Emphasize search, filtering, reading, and document access
- Avoid editing controls or operational actions
- Make the interface lighter and less dense than Admin and Agent
- Ensure the design is suitable for a real administrative office and role-based security

Output:
- High-fidelity Android mobile screens
- Complete Lecteur flow
- Consistent professional design system
- Ready for prototype inspiration in Stitch