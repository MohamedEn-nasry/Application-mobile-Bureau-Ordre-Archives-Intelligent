import { CourrierOverviewScreen } from "../../modules/courrier/presentation/screens/CourrierOverviewScreen";

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
    CourrierOverview: 'CourrierOverview',
    CourrierDetail: 'CourrierDetail',
    CreateUpdateCourrier: 'CreateUpdateCourrier',

    Reports: 'Reports',
    Archives: 'Archives',
    Notifications: 'Notifications',

    Settings: 'SystemSettings',
    Notifications: 'Notifications',
  },


  Agent: {
    Dashboard: 'AgentDashboard',
    CreateUpdateCourrier: 'CreateUpdateCourrier',
    Courrier: 'AgentCourrier',
    CourrierDetail: 'AgentCourrierDetail',
    CourrierOverview: 'AgentCourrierOverview',
    IncomingMail: 'AgentIncomingMail',
    OutgoingMail: 'AgentOutgoingMail',
    Profile: 'AgentProfile',
    Alerts: 'AgentAlerts',
    Notifications: 'AgentNotifications',
    OcrResults: 'AgentOcrResults',
  },


  Lecteur: {
    Dashboard: 'LecteurDashboard',
    CourrierOverview: 'LecteurCourrierOverview',
    CourrierDetail: 'LectureCourrierDetail',
    Notifications: 'LecteurNotifications',
    Profile: 'LecteurProfile',
    Archives: 'LecteurArchives',
  }
} as const;

