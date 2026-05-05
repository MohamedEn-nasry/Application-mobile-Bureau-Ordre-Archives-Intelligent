import { QuickAction } from '../../domain/entities/DashboardStats';
import { Routes } from '../../../../shared/constants/routes';

/**
 * Centralised quick-action definitions.
 * routeName maps to a registered screen name in AdminStack.
 */
export const ADMIN_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'qa-mail',
    label: 'Courriers',
    icon: 'mail',
    routeName: Routes.Admin.CourrierOverview,
    colorScheme: 'sky',
  },
  {
    id: 'qa-users',
    label: 'Utilisateurs',
    icon: 'users',
    routeName: Routes.Admin.UsersList,
    colorScheme: 'blue',
  },
  {
    id: 'qa-reports',
    label: 'Rapports',
    icon: 'file-bar-chart',
    routeName: Routes.Admin.Reports,
    colorScheme: 'violet',
  },
  {
    id: 'qa-notifications',
    label: 'Notifications',
    icon: 'bell',
    routeName: Routes.Admin.Notifications,
    colorScheme: 'amber',
  },
];
