import AsyncStorage from "@react-native-async-storage/async-storage";
// Alternatively you can use expo-secure-store for better security

const KEYS = {
  ACCESS_TOKEN: "@auth_token",
  REFRESH_TOKEN: "@auth_refresh_token",
  EMAIL: "@auth_email",
  USER_ID: "@auth_user_id",
  FULL_NAME: "@auth_full_name",
  ROLE: "@auth_role",
} as const;

export interface TokenStorage {
  // Access token
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;

  // Refresh token
  getRefreshToken(): Promise<string | null>;
  setRefreshToken(token: string): Promise<void>;
  clearRefreshToken(): Promise<void>;

  // Email (needed for refresh & logout requests)
  getEmail(): Promise<string | null>;
  setEmail(email: string): Promise<void>;
  clearEmail(): Promise<void>;

  // User info (to restore session without /auth/me)
  getUserId(): Promise<string | null>;
  setUserId(id: string): Promise<void>;
  getFullName(): Promise<string | null>;
  setFullName(name: string): Promise<void>;
  getRole(): Promise<string | null>;
  setRole(role: string): Promise<void>;

  // Clear everything at once
  clearAll(): Promise<void>;
}

export const tokenStorage: TokenStorage = {
  // ──── Access Token ────────────────────────────────────────────────
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  },
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
  },
  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
  },

  // ──── Refresh Token ───────────────────────────────────────────────
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  },
  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);
  },
  async clearRefreshToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.REFRESH_TOKEN);
  },

  // ──── Email ───────────────────────────────────────────────────────
  async getEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.EMAIL);
    } catch {
      return null;
    }
  },
  async setEmail(email: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.EMAIL, email);
  },
  async clearEmail(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.EMAIL);
  },

  // ──── User Info ───────────────────────────────────────────────────
  async getUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.USER_ID);
    } catch {
      return null;
    }
  },
  async setUserId(id: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_ID, id);
  },
  async getFullName(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.FULL_NAME);
    } catch {
      return null;
    }
  },
  async setFullName(name: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.FULL_NAME, name);
  },
  async getRole(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.ROLE);
    } catch {
      return null;
    }
  },
  async setRole(role: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ROLE, role);
  },

  // ──── Clear All ───────────────────────────────────────────────────
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.EMAIL,
      KEYS.USER_ID,
      KEYS.FULL_NAME,
      KEYS.ROLE,
    ]);
  },
};
