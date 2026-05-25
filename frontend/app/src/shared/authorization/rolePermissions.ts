import { Roles, Role } from '../constants/roles';
import { Permissions, Permission } from '../constants/permissions';

export const RolePermissions: Record<Role, Permission[]> = {
  [Roles.ADMIN]: [
    Permissions.MANAGE_USERS,
    Permissions.VIEW_USERS,
    Permissions.CREATE_ARCHIVE,
    Permissions.VIEW_ARCHIVES,
 
    Permissions.COURRIER_VIEW_ALL,
    Permissions.COURRIER_REASSIGN,

    Permissions.VIEW_DOCUMENTS
  ],
  [Roles.AGENT]: [
    Permissions.COURRIER_VIEW_OWN,
    Permissions.COURRIER_CREATE,
    Permissions.COURRIER_UPDATE,
    Permissions.COURRIER_CHANGE_STATUS,
    Permissions.COURRIER_ARCHIVE,
  ],
  [Roles.SUPER_AGENT]: [
    Permissions.COURRIER_VIEW_OWN,
    Permissions.COURRIER_CREATE,
    Permissions.COURRIER_UPDATE,
    Permissions.COURRIER_CHANGE_STATUS,
    Permissions.COURRIER_ARCHIVE,
    Permissions.COURRIER_REASSIGN,
  ],
  [Roles.LECTEUR]: [
    Permissions.COURRIER_VIEW_ALL,
  ]
};
