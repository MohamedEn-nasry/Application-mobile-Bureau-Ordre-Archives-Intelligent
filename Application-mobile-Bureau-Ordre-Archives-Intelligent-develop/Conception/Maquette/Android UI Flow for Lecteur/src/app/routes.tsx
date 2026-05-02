import { createBrowserRouter, Navigate } from 'react-router';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MailListScreen } from './screens/MailListScreen';
import { MailDetailScreen } from './screens/MailDetailScreen';
import { DocumentViewerScreen } from './screens/DocumentViewerScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ArchiveScreen } from './screens/ArchiveScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MainLayout } from './layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    Component: LoginScreen,
  },
  {
    path: '/app',
    Component: MainLayout,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardScreen },
      { path: 'mail', Component: MailListScreen },
      { path: 'mail/:id', Component: MailDetailScreen },
      { path: 'search', Component: SearchResultsScreen },
      { path: 'notifications', Component: NotificationsScreen },
      { path: 'archive', Component: ArchiveScreen },
      { path: 'profile', Component: ProfileScreen },
    ],
  },
  {
    path: '/document/:id',
    Component: DocumentViewerScreen,
  },
]);
