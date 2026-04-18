import { Role } from '../constants/roles';
import { Permission } from '../constants/permissions';
import { RolePermissions } from './rolePermissions';

export const can = (role: Role | null | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const permissions = RolePermissions[role];
  return permissions?.includes(permission) ?? false;
};
