// src/navigation/AgentNavigator.js
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../shared/theme';

import AgentDashboard from '../modules/dashboard/presentation/screens/AgentDashboard.js';
import AgentIncomingScreen from '../modules/courrier/presentation/screens/AgentIncomingScreen.js';
import AgentAddIncomingScreen from '../modules/courrier/presentation/screens/AgentAddIncomingScreen.js';
import AgentIncomingDetailScreen from '../modules/courrier/presentation/screens/AgentIncomingDetailScreen.js';
import AgentOutgoingScreen from '../modules/courrier/presentation/screens/AgentOutgoingScreen.js';
import AgentAddOutgoingScreen from '../modules/courrier/presentation/screens/AgentAddOutgoingScreen.js';
import AgentOutgoingDetailScreen from '../modules/courrier/presentation/screens/AgentOutgoingDetailScreen.js';
import AgentScanScreen from '../modules/scan/presentation/screens/AgentScanScreen.js';
import AgentOCRScreen from '../modules/ocr/presentation/screens/AgentOCRScreen.js';
import AgentClassificationScreen from '../modules/classification/presentation/screens/AgentClassificationScreen.js';
import AgentNotificationsScreen from '../modules/notifications/presentation/screens/AgentNotificationsScreen.js';
import AgentProfileScreen from '../modules/profile/presentation/screens/AgentProfileScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgentDashboardMain" component={AgentDashboard} />
      <Stack.Screen name="AgentScan" component={AgentScanScreen} />
      <Stack.Screen name="AgentOCR" component={AgentOCRScreen} />
      <Stack.Screen name="AgentClassification" component={AgentClassificationScreen} />
      <Stack.Screen name="AgentAddIncoming" component={AgentAddIncomingScreen} />
      <Stack.Screen name="AgentAddOutgoing" component={AgentAddOutgoingScreen} />
      <Stack.Screen name="AgentIncomingDetail" component={AgentIncomingDetailScreen} />
      <Stack.Screen name="AgentOutgoingDetail" component={AgentOutgoingDetailScreen} />
      <Stack.Screen name="AgentNotifications" component={AgentNotificationsScreen} />
      <Stack.Screen name="AgentProfile" component={AgentProfileScreen} />
    </Stack.Navigator>
  );
}

function IncomingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgentIncomingMain" component={AgentIncomingScreen} />
      <Stack.Screen name="AgentIncomingDetail" component={AgentIncomingDetailScreen} />
      <Stack.Screen name="AgentAddIncoming" component={AgentAddIncomingScreen} />
      <Stack.Screen name="AgentOCR" component={AgentOCRScreen} />
      <Stack.Screen name="AgentClassification" component={AgentClassificationScreen} />
    </Stack.Navigator>
  );
}

function OutgoingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgentOutgoingMain" component={AgentOutgoingScreen} />
      <Stack.Screen name="AgentOutgoingDetail" component={AgentOutgoingDetailScreen} />
      <Stack.Screen name="AgentAddOutgoing" component={AgentAddOutgoingScreen} />
    </Stack.Navigator>
  );
}

function NotifStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgentNotifMain" component={AgentNotificationsScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgentProfileMain" component={AgentProfileScreen} />
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

export default function AgentNavigator() {
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
      <Tab.Screen name="Incoming" component={IncomingStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="📥" focused={focused} />, tabBarLabel: 'Entrant' }} />
      <Tab.Screen name="Outgoing" component={OutgoingStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="📤" focused={focused} />, tabBarLabel: 'Sortant' }} />
      <Tab.Screen name="AgentNotifications" component={NotifStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="🔔" focused={focused} badge={2} />, tabBarLabel: 'Alertes' }} />
      <Tab.Screen name="AgentProfile" component={ProfileStack}
        options={{ tabBarIcon: ({ focused }) => <TAB_ICON emoji="👤" focused={focused} />, tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}