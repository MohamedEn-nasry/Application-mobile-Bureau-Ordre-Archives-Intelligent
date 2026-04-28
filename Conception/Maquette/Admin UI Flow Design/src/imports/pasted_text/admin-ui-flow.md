Design a complete modern Android mobile UI flow for the Admin role of an application called “Intelligent Bureau d’Ordre”, a smart administrative mail and document management system.

Important product rules:
- There is NO public sign-up
- User accounts are created and managed only by the Admin
- Regular users only log in with credentials assigned by the Admin
- Role-based access exists for Admin, Agent, and Lecteur
- The Admin has full access to user management, role assignment, system settings, and full mail overview

Design style:
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

Create the following Admin screens as a cohesive design system:

1. Admin Login Screen
Purpose:
- Secure access for admin users only

Include:
- App logo
- App name: Intelligent Bureau d’Ordre
- Title: Welcome Back
- Subtitle: Sign in to access the admin workspace
- Input: Username or Email
- Input: Password
- Remember me checkbox
- Forgot password link
- Primary button: Log In
- Small footer note: Account access is managed by the system administrator

Important:
- Do NOT include Sign Up
- Do NOT include Create Account
- This app supports login only

2. Admin Dashboard Screen
Purpose:
- Main control center for the administrator

Include:
- Top app bar with app name, menu icon, notification icon
- Greeting header
- Search bar
- Summary cards:
  - Total Incoming Mail
  - Total Outgoing Mail
  - Pending Mail
  - Archived Mail
  - Total Users
- Recent Activity section
- Notifications preview
- Quick actions:
  - Manage Users
  - Assign Roles
  - View All Mail
  - Reports
  - System Settings
- Optional analytics preview with small chart or stats panel
- Bottom navigation:
  - Dashboard
  - Mail
  - Users
  - Notifications
  - Settings

The dashboard should feel analytical, organized, and management-focused.

3. Mail Overview Screen
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

4. Incoming Mail Detail Screen (Admin View)
Purpose:
- Full read and control access over incoming mail

Include:
- Reference
- Date received
- Sender
- Subject
- Description
- Attachments preview
- OCR extracted text section
- Classification suggestion with confidence score
- Status dropdown
- Action buttons:
  - Edit
  - Archive
  - Reassign
  - Run OCR
  - View History

5. Outgoing Mail Detail Screen (Admin View)
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

6. Users Management Screen
Purpose:
- Admin manages all system users

Include:
- Title: Users Management
- Search bar
- User list with:
  - Avatar
  - Full name
  - Email / Username
  - Role badge
  - Account status
- Actions per user:
  - View
  - Edit
  - Disable
  - Reset password
- Floating or primary action button: Add User

The screen should look like a compact administrative panel.

7. Create User Screen
Purpose:
- Admin creates a new user account

Include:
- Title: Create User
- Form fields:
  - Full Name
  - Username
  - Email
  - Password
  - Confirm Password
  - Phone number (optional)
  - Role dropdown
  - Account status toggle
- Primary button: Create Account

Important:
- This screen is only for Admin
- Users cannot self-register

8. Edit User / Assign Role Screen
Purpose:
- Admin edits user information and changes permissions

Include:
- User profile card
- Editable fields:
  - Name
  - Username
  - Email
  - Role
  - Status
- Roles available:
  - Admin
  - Agent
  - Lecteur
- Permissions summary card
- Save Changes button
- Disable account action
- Reset password action

9. Roles & Permissions Screen
Purpose:
- Show role definitions and system access levels

Include:
- Role cards:
  - Admin
  - Agent
  - Lecteur
- Each card shows permissions summary
- Admin:
  - full access
  - manage users
  - assign roles
  - settings
  - all mail access
- Agent:
  - create and edit mail
  - scan documents
  - run OCR
  - update status
- Lecteur:
  - read-only consultation
  - search and view documents
- Optional edit permissions layout if needed

10. Notifications Screen (Admin)
Purpose:
- Central place for alerts and system messages

Include:
- Tabs:
  - All
  - System
  - Mail Updates
  - Security
- Notification cards:
  - system update scheduled
  - security alert
  - user created
  - role changed
  - mail status updated
- Mark as read
- Open related item

11. Reports / Analytics Screen
Purpose:
- Admin monitors activity and performance

Include:
- Title: Reports & Analytics
- Cards or charts for:
  - Incoming vs outgoing mail
  - Pending items
  - Archived items
  - Mail by category
  - User activity
- Date range filter
- Export report action
- Professional admin analytics style

12. System Settings Screen
Purpose:
- Admin configures app-level settings

Include:
- General settings
- Notification settings
- Security settings
- Language
- Backup / archive settings
- OCR / classification configuration
- Save settings button

13. Admin Profile Screen
Purpose:
- Admin personal account area

Include:
- Profile picture
- Name
- Email
- Role: Admin
- Edit profile
- Change password
- Logout button

Navigation requirements:
- Keep a consistent bottom navigation:
  - Dashboard
  - Mail
  - Users
  - Notifications
  - Settings
- Use reusable cards, badges, input fields, and buttons
- Keep strong consistency across all Admin screens

UX requirements:
- Make all screens practical for real administrative office use
- Prioritize clarity, control, and efficiency
- The Admin flow should feel secure, analytical, and authoritative
- Ensure all important actions are prominent but cleanly organized
- Avoid unnecessary decorative clutter
- Maintain enterprise-level visual quality

Output:
- High-fidelity Android mobile screens
- Complete Admin flow
- Consistent professional design system
- Ready for prototype inspiration in Stitch