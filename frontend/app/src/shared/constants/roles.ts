export const Roles = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  LECTEUR: 'LECTEUR',
} as const;

export type Role = typeof Roles[keyof typeof Roles];
