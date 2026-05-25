export const Roles = {
  ADMIN: "Admin",
  AGENT: "Agent",
  SUPER_AGENT: "SuperAgent",
  LECTEUR: "Lecteur",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
