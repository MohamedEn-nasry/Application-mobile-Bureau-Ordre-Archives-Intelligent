export const Routes = {
  Auth: {
    Login: 'Login'
  },
  Admin: {
    Dashboard: 'AdminDashboard',
    UsersList: 'UsersList',
    CreateUpdateUser: 'CreateUpdateUser',
    ChangePassword: 'ChangePassword',
    UserDetails: 'UserDetails',
    Roles: 'Roles',
    Mail: 'MailOverview',
    Reports: 'Reports',
    Settings: 'SystemSettings',
    Notifications: 'Notifications',
  },
  Agent: {
    Dashboard: 'AgentDashboard',
    Profile: 'AgentProfile',
    EditProfile: 'EditProfile',
    ChangePassword: 'ChangePassword',
    LanguageSettings: 'LanguageSettings',
    HelpDocumentation: 'HelpDocumentation',
    SecurityPrivacy: 'SecurityPrivacy',
    Incoming: 'IncomingMail',
    Outgoing: 'OutgoingMail',
    Alerts: 'AgentAlerts'
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard'
  }
} as const;

