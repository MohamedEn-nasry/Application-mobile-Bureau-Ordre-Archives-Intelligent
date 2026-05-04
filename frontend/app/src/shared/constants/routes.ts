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
    OutgoingMail: 'OutgoingMail',
    OutgoingMailDetail: 'OutgoingMailDetail',
    AddOutgoingMail: 'AddOutgoingMail',
    IncomingMail: 'IncomingMail',
    Alerts: 'AgentAlerts',
    Profile: 'AgentProfile'
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard'
  }
} as const;

