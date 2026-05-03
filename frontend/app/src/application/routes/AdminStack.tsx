import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../../modules/dashboard/presentation/screens/DashboardScreen';
import { UsersListScreen } from '../../modules/users/presentation/screens/UsersListScreen';
import { CreateUpdateUserScreen } from '../../modules/users/presentation/screens/CreateUpdateUserScreen';
import { Routes } from '../../shared/constants/routes';
import { ChangePasswordScreen } from '../../shared/presentation/screens/ChangePasswordScreen';
<<<<<<< HEAD
import { OutgoingCourrierListScreen } from '../../modules/courrier/presentation/screens/OutgoingCourrierListScreen';
import { CourrierDetailsScreen } from '../../modules/courrier/presentation/screens/CourrierDetailsScreen';
import { EditCourrierScreen } from '../../modules/courrier/presentation/screens/EditCourrierScreen';
import { IncomingCourrierDetailsScreen } from '../../modules/courrier/presentation/screens/IncomingCourrierDetailsScreen';
=======
import { ConnectedNotificationsScreen } from '../../modules/notifications/presentation/screens/ConnectedNotificationsScreen';
>>>>>>> origin/develop

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
<<<<<<< HEAD
        name={Routes.Admin.OutgoingCourrier}
        component={OutgoingCourrierListScreen}
        options={{ headerShown: true, title: 'Courrier Sortant' }}
      />
      <Stack.Screen
        name={Routes.Admin.CourrierDetails}
        component={CourrierDetailsScreen}
        options={{ headerShown: true, title: 'Détails du Courrier' }}
      />
      <Stack.Screen
        name={Routes.Admin.EditCourrier}
        component={EditCourrierScreen}
        options={{ headerShown: true, title: 'Modifier le Courrier' }}
      />
      <Stack.Screen
        name={Routes.Admin.IncomingCourrierDetails}
        component={IncomingCourrierDetailsScreen}
        options={{ headerShown: true, title: 'Courrier Entrant' }}
=======
        name={Routes.Admin.Notifications}
        component={ConnectedNotificationsScreen}
        options={{ headerShown: true, title: 'Notifications' }}
>>>>>>> origin/develop
      />
    </Stack.Navigator>
  );
};
