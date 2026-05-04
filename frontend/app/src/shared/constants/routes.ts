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
    CourrierList: 'CourrierList',
    IncomingMailDetail: 'IncomingMailDetail',
    Reports: 'Reports',
    Archives: 'Archives',
    Notifications: 'Notifications',
    Settings: 'SystemSettings',
  },
  Agent: {
    Dashboard: 'AgentDashboard'
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard'
  }
} as const;

