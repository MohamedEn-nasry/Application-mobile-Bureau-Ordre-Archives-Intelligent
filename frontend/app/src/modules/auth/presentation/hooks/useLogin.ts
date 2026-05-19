import { useState } from "react";
import { container } from "../../../../core/di/container";
import { LoginUseCase } from "../../domain/usecases/LoginUseCase";
import { useAuthSession } from "./useAuthSession";

export const useLogin = () => {
  const { setSession } = useAuthSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const useCase = container.resolve<LoginUseCase>("LoginUseCase");
      const result = await useCase.execute({ email, password });

      if (result.isError()) {
        setError(result.error.message);
        return false;
      }

      setSession(result.value);
      return true;
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
