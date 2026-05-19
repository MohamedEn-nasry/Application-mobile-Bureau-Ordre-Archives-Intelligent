import React, { ReactNode, useState } from "react";

// You can add ThemeProvider, LanguageProvider, StoreProvider here
// For example: <QueryClientProvider client={queryClient}>...</QueryClientProvider>

import { AuthProvider } from "./AuthProvider";
import { AuthSession } from "../../modules/auth/domain/entities/AuthSession";
import { NotificationsProvider } from "../../modules/notifications/presentation/providers/NotificationsProvider";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  );
};
