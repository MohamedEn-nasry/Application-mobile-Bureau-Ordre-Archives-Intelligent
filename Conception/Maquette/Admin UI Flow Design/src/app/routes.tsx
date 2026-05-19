import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/layout/RootLayout';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { MailOverviewScreen } from './components/screens/MailOverviewScreen';
import { IncomingMailDetailScreen } from './components/screens/IncomingMailDetailScreen';
import { OutgoingMailDetailScreen } from './components/screens/OutgoingMailDetailScreen';
import { UsersManagementScreen } from './components/screens/UsersManagementScreen';
import { CreateUserScreen } from './components/screens/CreateUserScreen';
import { EditUserScreen } from './components/screens/EditUserScreen';
import { RolesPermissionsScreen } from './components/screens/RolesPermissionsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { SystemSettingsScreen } from './components/screens/SystemSettingsScreen';
import { AdminProfileScreen } from './components/screens/AdminProfileScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', Component: LoginScreen },
      { path: 'dashboard', Component: DashboardScreen },
      { path: 'mail', Component: MailOverviewScreen },
      { path: 'mail/incoming/:id', Component: IncomingMailDetailScreen },
      { path: 'mail/outgoing/:id', Component: OutgoingMailDetailScreen },
      { path: 'users', Component: UsersManagementScreen },
      { path: 'users/create', Component: CreateUserScreen },
      { path: 'users/edit/:id', Component: EditUserScreen },
      { path: 'roles', Component: RolesPermissionsScreen },
      { path: 'notifications', Component: NotificationsScreen },
      { path: 'reports', Component: ReportsScreen },
      { path: 'settings', Component: SystemSettingsScreen },
      { path: 'profile', Component: AdminProfileScreen },
    ],
  },
]);
