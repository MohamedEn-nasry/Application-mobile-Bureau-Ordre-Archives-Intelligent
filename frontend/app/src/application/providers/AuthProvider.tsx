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
import { RefreshTokenUseCase } from "../../modules/auth/domain/usecases/RefreshTokenUseCase";
import { tokenStorage } from "../../core/storage/tokenStorage";

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  setSession: (session: AuthSession | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
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

  // ──── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      const logoutUseCase = container.resolve<LogoutUseCase>("LogoutUseCase");

      // Retrieve credentials from session state OR storage as fallback
      const email = session?.email ?? (await tokenStorage.getEmail()) ?? "";
      const refreshToken =
        session?.refreshToken ??
        (await tokenStorage.getRefreshToken()) ??
        "";

      await logoutUseCase.execute({ email, refreshToken });
    } catch (e) {
      console.error("Failed to logout", e);
      // Even on error, clear tokens locally
      await tokenStorage.clearAll();
    } finally {
      setSession(null);
    }
  }, [session]);

  // ──── Refresh Session ────────────────────────────────────────────────────
  // Call this to manually refresh if needed (e.g., after app foreground)
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const refreshUseCase =
        container.resolve<RefreshTokenUseCase>("RefreshTokenUseCase");

      const email = session?.email ?? (await tokenStorage.getEmail());
      const refreshToken =
        session?.refreshToken ?? (await tokenStorage.getRefreshToken());

      if (!email || !refreshToken) {
        setSession(null);
        return false;
      }

      const result = await refreshUseCase.execute({ email, refreshToken });

      if (result.isSuccess() && result.value) {
        setSession(result.value);
        return true;
      } else {
        setSession(null);
        return false;
      }
    } catch (e) {
      console.error("Failed to refresh session", e);
      setSession(null);
      return false;
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, setSession, logout, refreshSession }}
    >
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