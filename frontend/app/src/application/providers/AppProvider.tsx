import React, { ReactNode } from 'react';

// You can add ThemeProvider, LanguageProvider, StoreProvider here
// For example: <QueryClientProvider client={queryClient}>...</QueryClientProvider>

import { AuthProvider } from './AuthProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
