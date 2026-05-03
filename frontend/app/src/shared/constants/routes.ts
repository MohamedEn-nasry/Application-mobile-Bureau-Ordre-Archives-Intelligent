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
    CourrierOverview: 'CourrierOverview',
    CourrierDetail: 'CourrierDetail',
    CreateUpdateCourrier: 'CreateUpdateCourrier',
    Reports: 'Reports',
    Settings: 'SystemSettings',
    Notifications: 'Notifications',
  },
  Agent: {
    Dashboard: 'AgentDashboard'
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard'
  }
} as const;

