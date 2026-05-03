import React, { ReactNode, useState } from "react";

// You can add ThemeProvider, LanguageProvider, StoreProvider here
// For example: <QueryClientProvider client={queryClient}>...</QueryClientProvider>

import { AuthProvider } from "./AuthProvider";
import { AuthSession } from "../../modules/auth/domain/entities/AuthSession";
<<<<<<< HEAD
=======
import { NotificationsProvider } from "../../modules/notifications/presentation/providers/NotificationsProvider";
>>>>>>> origin/develop

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
<<<<<<< HEAD
  return <AuthProvider>{children}</AuthProvider>;
=======
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  );
>>>>>>> origin/develop
};
