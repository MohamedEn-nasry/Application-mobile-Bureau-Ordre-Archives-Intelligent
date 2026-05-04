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
  },
  Agent: {
    Dashboard: 'AgentDashboard',
    IncomingMail: 'IncomingMail',
    AddIncomingMail: 'AddIncomingMail',
    IncomingMailDetail: 'IncomingMailDetail'
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard'
  }
} as const;

