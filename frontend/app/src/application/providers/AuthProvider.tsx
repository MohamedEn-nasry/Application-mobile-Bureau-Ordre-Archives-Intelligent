import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useContext,
} from "react";

import { AuthSession } from "../../modules/auth/domain/entities/AuthSession";
import { container } from "../../core/di/container";
import { CheckAuthUseCase } from "../../modules/auth/domain/usecases/CheckAuthUseCase";
import { LogoutUseCase } from "../../modules/auth/domain/usecases/LogoutUseCase";

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
      } else {
        setSession(null);
      }
    } catch (e) {
      console.error("Failed to load session", e);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const logout = useCallback(async () => {
    try {
      const logoutUseCase =
        container.resolve<LogoutUseCase>("LogoutUseCase");

      await logoutUseCase.execute();
    } catch (e) {
      console.error("Failed to logout", e);
    } finally {
      setSession(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};