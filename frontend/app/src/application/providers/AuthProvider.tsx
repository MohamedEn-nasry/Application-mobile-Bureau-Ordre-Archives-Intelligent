import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { AuthSession } from "../../modules/auth/domain/entities/AuthSession";
import { tokenStorage } from "../../core/storage/tokenStorage";
import { container } from "../../core/di/container";
import { CheckAuthUseCase } from "../../modules/auth/domain/usecases/CheckAuthUseCase";
interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  setSession: (session: AuthSession | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadSession = useCallback(async () => {
    try {
      const checkAuthUseCase =
        container.resolve<CheckAuthUseCase>("CheckAuthUseCase");
      const result = await checkAuthUseCase.execute();
      if (result.isSuccess()) {
        setSession(result.value);
      }
    } catch (e) {
      console.error("Failed to load session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const logout = async () => {
    await tokenStorage.clearToken();
    setSession(null);
  };
  return (
    <AuthContext.Provider value={{ session, isLoading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
