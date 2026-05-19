import { useMemo } from 'react';
import { useAuthSession } from '../../modules/auth/presentation/hooks/useAuthSession';
import { Role } from '../../shared/constants/roles';

export type CourrierInitialParams = {
  roleName: Role;
  userId: string;
};

export const useCourrierInitialParams = (roleName: Role): CourrierInitialParams => {
  const { session } = useAuthSession();

  return useMemo(
    () => ({
      roleName,
      userId: session?.userId ?? '0',
    }), [roleName, session?.userId]
  );
};

