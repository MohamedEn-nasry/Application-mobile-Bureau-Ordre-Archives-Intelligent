import { createBrowserRouter } from 'react-router';
import { PhoneFrame } from './layouts/PhoneFrame';
import { AppLayout } from './layouts/AppLayout';
import { LoginScreen } from './pages/LoginScreen';
import { DashboardScreen } from './pages/DashboardScreen';
import { IncomingListScreen } from './pages/IncomingListScreen';
import { AddIncomingScreen } from './pages/AddIncomingScreen';
import { IncomingDetailScreen } from './pages/IncomingDetailScreen';
import { OutgoingListScreen } from './pages/OutgoingListScreen';
import { AddOutgoingScreen } from './pages/AddOutgoingScreen';
import { OutgoingDetailScreen } from './pages/OutgoingDetailScreen';
import { ScanDocumentScreen } from './pages/ScanDocumentScreen';
import { OCRResultScreen } from './pages/OCRResultScreen';
import { ClassificationScreen } from './pages/ClassificationScreen';
import { NotificationsScreen } from './pages/NotificationsScreen';
import { ProfileScreen } from './pages/ProfileScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PhoneFrame,
    children: [
      // No bottom nav
      { index: true, Component: LoginScreen },
      { path: 'scan', Component: ScanDocumentScreen },
      { path: 'ocr', Component: OCRResultScreen },
      { path: 'classification', Component: ClassificationScreen },
      { path: 'incoming/add', Component: AddIncomingScreen },
      { path: 'outgoing/add', Component: AddOutgoingScreen },
      { path: 'incoming/:id', Component: IncomingDetailScreen },
      { path: 'outgoing/:id', Component: OutgoingDetailScreen },
      // With bottom nav
      {
        Component: AppLayout,
        children: [
          { path: 'dashboard', Component: DashboardScreen },
          { path: 'incoming', Component: IncomingListScreen },
          { path: 'outgoing', Component: OutgoingListScreen },
          { path: 'notifications', Component: NotificationsScreen },
          { path: 'profile', Component: ProfileScreen },
        ],
      },
    ],
  },
]);
