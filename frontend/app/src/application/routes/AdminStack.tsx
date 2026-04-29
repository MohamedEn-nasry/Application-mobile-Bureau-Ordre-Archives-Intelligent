import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../../modules/dashboard/presentation/screens/DashboardScreen';
import { UsersListScreen } from '../../modules/users/presentation/screens/UsersListScreen';
import { CreateUpdateUserScreen } from '../../modules/users/presentation/screens/CreateUpdateUserScreen';
import { Routes } from '../../shared/constants/routes';
import { ChangePasswordScreen } from '../../shared/presentation/screens/ChangePasswordScreen';
import { ReportsScreen } from '../../modules/dashboard/presentation/screens/ReportsScreen';
import { MailOverviewScreen } from '../../modules/courrier/presentation/screens/MailOverviewScreen';
import { IncomingMailDetailScreen } from '../../modules/courrier/presentation/screens/IncomingMailDetailScreen';

const Stack = createNativeStackNavigator();

export const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Admin.Dashboard}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={Routes.Admin.Dashboard}
        component={AdminDashboardScreen}
      />
      <Stack.Screen
        name={Routes.Admin.UsersList}
        component={UsersListScreen}
        options={{ headerShown: true, title: 'Gestion Utilisateurs' }}
      />
      <Stack.Screen
        name={Routes.Admin.CreateUpdateUser}
        component={CreateUpdateUserScreen}
        options={{ headerShown: true, title: 'Créer / Modifier Utilisateur' }}
      />
      <Stack.Screen
        name={Routes.Admin.ChangePassword}
        component={ChangePasswordScreen}
        options={{ headerShown: true, title: 'Réinit. mot de passe' }}
      />
      <Stack.Screen
        name={Routes.Admin.Reports}
        component={ReportsScreen}
        options={{ headerShown: true, title: 'Rapports & Statistiques' }}
      />
      <Stack.Screen
        name={Routes.Admin.Mail}
        component={MailOverviewScreen}
        options={{ headerShown: true, title: 'Courrier' }}
      />
      <Stack.Screen
        name={Routes.Admin.IncomingMailDetail}
        component={IncomingMailDetailScreen}
        options={{ headerShown: true, title: 'Détails du Courrier' }}
      />
    </Stack.Navigator>
  );
};

