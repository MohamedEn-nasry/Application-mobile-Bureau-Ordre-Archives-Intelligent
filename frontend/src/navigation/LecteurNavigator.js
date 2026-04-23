// src/navigation/LecteurNavigator.js
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

import LecteurDashboard from '../screens/lecteur/LecteurDashboard';
import LecteurMailScreen from '../screens/lecteur/LecteurMailScreen';
import LecteurMailDetailScreen from '../screens/lecteur/LecteurMailDetailScreen';
import LecteurDocumentViewerScreen from '../screens/lecteur/LecteurDocumentViewerScreen';
import LecteurSearchScreen from '../screens/lecteur/LecteurSearchScreen';
import LecteurArchiveScreen from '../screens/lecteur/LecteurArchiveScreen';
import LecteurNotificationsScreen from '../screens/lecteur/LecteurNotificationsScreen';
import LecteurProfileScreen from '../screens/lecteur/LecteurProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LecteurDashboardMain" component={LecteurDashboard} />
      <Stack.Screen name="LecteurMailDetail" component={LecteurMailDetailScreen} />
      <Stack.Screen name="LecteurDocumentViewer" component={LecteurDocumentViewerScreen} />
      <Stack.Screen name="LecteurSearch" component={LecteurSearchScreen} />
      <Stack.Screen name="LecteurArchive" component={LecteurArchiveScreen} />
      <Stack.Screen name="LecteurNotifications" component={LecteurNotificationsScreen} />
      <Stack.Screen name="LecteurProfile" component={LecteurProfileScreen} />
    </Stack.Navigator>
  );
}

function MailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LecteurMailMain" component={LecteurMailScreen} />
      <Stack.Screen name="LecteurMailDetail" component={LecteurMailDetailScreen} />
      <Stack.Screen name="LecteurDocumentViewer" component={LecteurDocumentViewerScreen} />
      <Stack.Screen name="LecteurArchive" component={LecteurArchiveScreen} />
    </Stack.Navigator>
  );
}

function NotifStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LecteurNotifMain" component={LecteurNotificationsScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LecteurProfileMain" component={LecteurProfileScreen} />
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

export default function LecteurNavigator() {
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
        tabBarActiveTintColor: Colors.teal600,
        tabBarInactiveTintColor: Colors.gray300,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 1 },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="🏠" focused={focused} />, tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="LecteurMail" component={MailStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="📨" focused={focused} />, tabBarLabel: 'Courrier' }} />
      <Tab.Screen name="LecteurNotifications" component={NotifStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="🔔" focused={focused} badge={1} />, tabBarLabel: 'Alertes' }} />
      <Tab.Screen name="LecteurProfile" component={ProfileStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="👤" focused={focused} />, tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}