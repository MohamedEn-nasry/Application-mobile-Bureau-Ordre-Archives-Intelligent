import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../../modules/dashboard/presentation/screens/DashboardScreen';
import { UsersListScreen } from '../../modules/users/presentation/screens/UsersListScreen';
import { CreateUpdateUserScreen } from '../../modules/users/presentation/screens/CreateUpdateUserScreen';
import { UserDetailsScreen } from '../../modules/users/presentation/screens/UserDetailsScreen';
import { Routes } from '../../shared/constants/routes';
import { ChangePasswordScreen } from '../../shared/presentation/screens/ChangePasswordScreen';
// import { ConnectedNotificationsScreen } from '../../modules/notifications/presentation/screens/ConnectedNotificationsScreen';
import { CourrierOverviewScreen } from '../../modules/courrier/presentation/screens/CourrierOverviewScreen';
import { CourrierDetailScreen } from '../../modules/courrier/presentation/screens/CourrierDetailScreen';
import { Roles } from '../../shared/constants/roles';
import { useCourrierInitialParams } from './useCourrierInitialParams';
import { NotificationsScreen } from '../../modules/notifications/presentation/screens/NotificationsScreen';

import { ReportsScreen } from '../../modules/reports/presentation/screens/ReportsScreen';



const Stack = createNativeStackNavigator();

export const AdminStack = () => {
  const courrierParams = useCourrierInitialParams(Roles.ADMIN);

  return (
    <Stack.Navigator
      id="AdminStack"
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

        name={Routes.Admin.UserDetails}
        component={UserDetailsScreen}
        options={{ headerShown: false }}
      />



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
      <Stack.Screen
        name={Routes.Admin.CourrierList}
        component={CourrierListScreen}
        options={{ headerShown: true, title: 'Courrier Entrant' }}
      />
      <Stack.Screen
        name={Routes.Admin.Archives}
        component={ArchivesListScreen}
        options={{ headerShown: true, title: 'Archives' }}
      />
      <Stack.Screen
        name={Routes.Admin.Roles}
        component={PlaceholderScreen}
        options={{ headerShown: true, title: 'Gestion des Rôles' }}
        initialParams={{ title: 'Gestion des Rôles', icon: '🛡️' }}
      />
      <Stack.Screen
        name={Routes.Admin.Settings}
        component={PlaceholderScreen}
        options={{ headerShown: true, title: 'Paramètres Système' }}
        initialParams={{ title: 'Paramètres Système', icon: '⚙️' }}
      />

      <Stack.Screen
        name={Routes.Admin.CourrierOverview}
        component={CourrierOverviewScreen}
        initialParams={courrierParams}
      />
      <Stack.Screen
        name={Routes.Admin.CourrierDetail}
        component={CourrierDetailScreen}
        initialParams={courrierParams}
      />
      <Stack.Screen
        name={Routes.Admin.Notifications}
        component={NotificationsScreen}
        initialParams={{
          roleName: Roles.ADMIN,
        }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

