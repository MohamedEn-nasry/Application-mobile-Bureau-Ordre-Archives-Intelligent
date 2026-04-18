import { Roles, Role } from '../constants/roles';
import { Permissions, Permission } from '../constants/permissions';

export const RolePermissions: Record<Role, Permission[]> = {
  [Roles.ADMIN]: [
    Permissions.MANAGE_USERS,
    Permissions.VIEW_USERS,
    Permissions.CREATE_ARCHIVE,
    Permissions.VIEW_ARCHIVES,
    Permissions.MANAGE_COURRIER,
    Permissions.VIEW_COURRIER,
    Permissions.MANAGE_DOCUMENTS,
    Permissions.VIEW_DOCUMENTS
  ],
  [Roles.AGENT]: [
    Permissions.CREATE_ARCHIVE,
    Permissions.VIEW_ARCHIVES,
    Permissions.MANAGE_COURRIER,
    Permissions.VIEW_COURRIER,
    Permissions.MANAGE_DOCUMENTS,
    Permissions.VIEW_DOCUMENTS
  ],
  [Roles.LECTEUR]: [
    Permissions.VIEW_ARCHIVES,
    Permissions.VIEW_COURRIER,
    Permissions.VIEW_DOCUMENTS
  ]
};
