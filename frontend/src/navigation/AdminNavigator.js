// src/navigation/AdminNavigator.js
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminMailScreen from '../screens/admin/AdminMailScreen';
import AdminMailDetailScreen from '../screens/admin/AdminMailDetailScreen';
import AdminOutgoingDetailScreen from '../screens/admin/AdminOutgoingDetailScreen';
import AdminMailHistoryScreen from '../screens/admin/AdminMailHistoryScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminCreateUserScreen from '../screens/admin/AdminCreateUserScreen';
import AdminEditUserScreen from '../screens/admin/AdminEditUserScreen';
import AdminRolesScreen from '../screens/admin/AdminRolesScreen';
import AdminNotificationsScreen from '../screens/admin/AdminNotificationsScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboardMain" component={AdminDashboard} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
      <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
      <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
      <Stack.Screen name="AdminMailDetail" component={AdminMailDetailScreen} />
      <Stack.Screen name="AdminOutgoingDetail" component={AdminOutgoingDetailScreen} />
      <Stack.Screen name="AdminMailHistory" component={AdminMailHistoryScreen} />
    </Stack.Navigator>
  );
}

function MailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMailMain" component={AdminMailScreen} />
      <Stack.Screen name="AdminMailDetail" component={AdminMailDetailScreen} />
      <Stack.Screen name="AdminOutgoingDetail" component={AdminOutgoingDetailScreen} />
      <Stack.Screen name="AdminMailHistory" component={AdminMailHistoryScreen} />
    </Stack.Navigator>
  );
}

function UsersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminUsersMain" component={AdminUsersScreen} />
      <Stack.Screen name="AdminCreateUser" component={AdminCreateUserScreen} />
      <Stack.Screen name="AdminEditUser" component={AdminEditUserScreen} />
      <Stack.Screen name="AdminRoles" component={AdminRolesScreen} />
    </Stack.Navigator>
  );
}

function NotifStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminNotifMain" component={AdminNotificationsScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminSettingsMain" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICON = ({ emoji, focused, badge }) => (
  <View style={{ position: 'relative' }}>
    <Text style={{ fontSize: 21, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
    {badge ? (
      <View style={{ position: 'absolute', top: -2, right: -6, backgroundColor: Colors.red400, borderRadius: 6, minWidth: 13, height: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.surface }}>
        <Text style={{ fontSize: 7, fontWeight: '900', color: '#fff' }}>{badge}</Text>
      </View>
    ) : null}
  </View>
);

export default function AdminNavigator() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: Colors.border,
          paddingBottom: bottomPad,
          paddingTop: 8,
          height: 56 + bottomPad,
        },
        tabBarActiveTintColor: Colors.blue800,
        tabBarInactiveTintColor: Colors.gray300,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 1 },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="🏠" focused={focused} />, tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Mail" component={MailStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="📨" focused={focused} />, tabBarLabel: 'Courrier' }} />
      <Tab.Screen name="AdminUsers" component={UsersStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="👥" focused={focused} />, tabBarLabel: 'Utilisateurs' }} />
      <Tab.Screen name="Notifications" component={NotifStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="🔔" focused={focused} badge={2} />, tabBarLabel: 'Alertes' }} />
      <Tab.Screen name="Settings" component={SettingsStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="⚙️" focused={focused} />, tabBarLabel: 'Paramètres' }} />
    </Tab.Navigator>
  );
}