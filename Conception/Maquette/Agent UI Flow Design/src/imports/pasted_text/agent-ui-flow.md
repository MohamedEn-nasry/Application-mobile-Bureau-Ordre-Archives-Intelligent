Design a complete modern Android mobile UI flow for the Agent role of an application called “Intelligent Bureau d’Ordre”, a smart administrative mail and document management system.

Important product rules:
- There is NO public sign-up
- User accounts are created and managed only by the Admin
- Regular users only log in with credentials assigned by the Admin
- Role-based access exists for Admin, Agent, and Lecteur
- The Agent is responsible for daily operational work: creating mail records, editing mail, scanning documents, running OCR, checking classification, and updating status

Design style:
- Clean, modern, professional
- Mobile-first Android UI
- Blue / indigo primary palette
- White or very light gray background
- Rounded cards and input fields
- Soft shadows
- Clear visual hierarchy
- Administrative / enterprise app design
- Consistent spacing and reusable components
- Practical and fast workflow

Create the following Agent screens as a cohesive design system:

1. Agent Login Screen
Purpose:
- Secure login for operational users

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

2. Agent Dashboard Screen
Purpose:
- Main operational home for the agent

Include:
- Top app bar with page title and notification icon
- Greeting header
- Search bar
- Summary cards:
  - Incoming Mail
  - Outgoing Mail
  - Pending Tasks
  - Recent Scans
- Quick actions:
  - Add Incoming Mail
  - Add Outgoing Mail
  - Scan Document
  - Run OCR
- Sections:
  - Assigned Mail
  - Recent Activity
  - OCR Results Preview
- Bottom navigation:
  - Dashboard
  - Incoming
  - Outgoing
  - Notifications
  - Profile

The dashboard should feel operational, efficient, and task-focused.

3. Incoming Mail List Screen
Purpose:
- Allow the agent to browse and manage incoming mail

Include:
- Title: Incoming Mail
- Search bar
- Filter chips:
  - Date
  - Sender
  - Subject
  - Status
- List cards showing:
  - Reference number
  - Sender
  - Subject
  - Date received
  - Status badge
- Floating action button: Add Incoming Mail
- Tap on card opens details

4. Add Incoming Mail Screen
Purpose:
- Agent creates a new incoming mail record

Include:
- Title: Add Incoming Mail
- Form fields:
  - Reference
  - Date received
  - Sender
  - Subject
  - Description
  - Attachments
  - Status
- Clean validation-friendly layout
- Save button

5. Incoming Mail Detail Screen
Purpose:
- View and update a single incoming mail item

Include:
- Reference
- Date received
- Sender
- Subject
- Description
- Attachments preview
- OCR extracted text section
- Suggested classification with confidence score
- Status dropdown
- Action buttons:
  - Edit
  - Update Status
  - Run OCR
  - Apply Classification

6. Outgoing Mail List Screen
Purpose:
- Allow the agent to browse and manage outgoing mail

Include:
- Title: Outgoing Mail
- Search bar
- Filter chips:
  - Date
  - Recipient
  - Subject
  - Status
- List cards showing:
  - Reference number
  - Recipient
  - Subject
  - Date sent
  - Status badge
- Floating action button: Add Outgoing Mail

7. Add Outgoing Mail Screen
Purpose:
- Agent creates a new outgoing mail record

Include:
- Title: Add Outgoing Mail
- Form fields:
  - Reference
  - Date sent
  - Recipient
  - Subject
  - Attachments
  - Status
- Save button

8. Outgoing Mail Detail Screen
Purpose:
- View and update an outgoing mail item

Include:
- Reference
- Date sent
- Recipient
- Subject
- Description
- Attachments preview
- Status dropdown
- Action buttons:
  - Edit
  - Update Status
  - Archive

9. Scan Document Screen
Purpose:
- Agent scans physical documents with the phone camera

Include:
- Title: Scan Document
- Camera preview
- Scanner frame overlay
- Capture button
- Flash icon
- Crop / adjust controls
- Enhance readability action
- Export options:
  - Save as Image
  - Save as PDF

10. OCR Result Screen
Purpose:
- Show extracted text from scanned document

Include:
- Title: OCR Result
- Scanned document preview
- Editable extracted text area
- Search inside text
- Confirm OCR button
- Attach to Mail button

11. Classification Screen
Purpose:
- Let the agent review and apply suggested category/type

Include:
- Title: Classification
- Suggested category card
- Confidence score
- Alternative suggestions
- Manual category dropdown
- Apply Classification button

12. Notifications Screen
Purpose:
- Show task-related updates for the agent

Include:
- Tabs:
  - All
  - Updates
  - Deadlines
- Notification cards for:
  - mail status updated
  - OCR completed
  - new assigned mail
  - reminder / deadline
- Mark as read interaction
- Open related mail item

13. Agent Profile Screen
Purpose:
- Personal account area for the agent

Include:
- Profile picture
- Name
- Email
- Role: Agent
- Edit profile
- Change password
- Logout button

Navigation requirements:
- Keep consistent bottom navigation:
  - Dashboard
  - Incoming
  - Outgoing
  - Notifications
  - Profile
- Make Scan Document visible as a quick action from Dashboard
- Reuse cards, badges, forms, and buttons across screens

UX requirements:
- The Agent flow should feel fast, practical, and workflow-oriented
- Focus on daily processing tasks rather than analytics
- Make actions like add, edit, scan, OCR, and update status highly accessible
- Keep forms clear and easy to use
- Ensure the design looks suitable for a real administrative office

Output:
- High-fidelity Android mobile screens
- Complete Agent flow
- Consistent professional design system
- Ready for prototype inspiration in Stitch