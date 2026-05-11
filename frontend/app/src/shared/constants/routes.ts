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
    CourrierOverview: 'CourrierOverview',
    CourrierDetail: 'CourrierDetail',
    CreateUpdateCourrier: 'CreateUpdateCourrier',
    Reports: 'AdminReports',
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
    Notifications: 'Notifications',
  },
  Lecteur: {
    Dashboard: 'LecteurDashboard',
    CourrierDetail: 'LectureCourrierDetail',
    CourrierOverview: 'LectureCourrierOverview'
  }
} as const;

