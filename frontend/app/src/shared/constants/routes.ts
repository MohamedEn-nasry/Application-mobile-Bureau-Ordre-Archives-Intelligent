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
<<<<<<< HEAD
    OutgoingCourrier: 'OutgoingCourrierList',
    CourrierDetails: 'CourrierDetails',
    IncomingCourrierDetails: 'IncomingCourrierDetails',
    CreateCourrier: 'CreateCourrier',
    EditCourrier: 'EditCourrier',
    Reports: 'Reports',
    Settings: 'SystemSettings',
=======
    Reports: 'Reports',
    Settings: 'SystemSettings',
    Notifications: 'Notifications',
>>>>>>> origin/develop
  },
  Agent: {
    Dashboard: 'AgentDashboard'
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard'
  }
} as const;

