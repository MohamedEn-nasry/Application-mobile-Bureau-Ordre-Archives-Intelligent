export const Roles = {
  ADMIN: "Admin",
  AGENT: "Agent",
  LECTEUR: "Lecteur",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
