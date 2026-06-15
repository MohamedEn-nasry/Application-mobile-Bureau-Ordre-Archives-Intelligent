import AsyncStorage from "@react-native-async-storage/async-storage";
// Alternatively you can use expo-secure-store for better security

export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

export const tokenStorage: TokenStorage = {
  //object literal implementation
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("@auth_token");
    } catch {
      return null;
    }
  },
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem("@auth_token", token);
  },
  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem("@auth_token");
  },
};
