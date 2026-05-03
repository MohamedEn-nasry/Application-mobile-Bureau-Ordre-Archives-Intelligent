import { QuickAction } from '../../domain/entities/DashboardStats';
import { Routes } from '../../../../shared/constants/routes';

/**
 * Centralised quick-action definitions.
 * routeName maps to a registered screen name in AdminStack.
 */
export const ADMIN_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'qa-users',
    label: 'Gestion\nUtilisateurs',
    icon: 'users',
    routeName: Routes.Admin.UsersList,
    colorScheme: 'blue',
  },
  {
    id: 'qa-roles',
    label: 'Assigner\nRôles',
    icon: 'shield',
    routeName: Routes.Admin.Roles,
    colorScheme: 'indigo',
  },
  {
    id: 'qa-mail',
    label: 'Courrier',
    icon: 'mail',
    routeName: Routes.Admin.OutgoingCourrier,
    colorScheme: 'sky',
  },
  {
    id: 'qa-reports',
    label: 'Rapports',
    icon: 'file-bar-chart',
    routeName: Routes.Admin.Reports,
    colorScheme: 'violet',
  },
  {
    id: 'qa-system-info',
    label: 'System\nInfo',
    icon: 'information-circle',
    routeName: Routes.Admin.SystemInfo,
    colorScheme: 'amber',
  },
  {
    id: 'qa-settings',
    label: 'Paramètres',
    icon: 'settings',
    routeName: Routes.Admin.Settings,
    colorScheme: 'slate',
  },
];
