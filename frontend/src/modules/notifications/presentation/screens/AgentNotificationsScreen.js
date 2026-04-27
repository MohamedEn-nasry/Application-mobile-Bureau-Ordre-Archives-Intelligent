// src/screens/agent/AgentNotificationsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, NotifCard, EmptyState } from '../../../../shared/components';
import { Colors, Spacing } from '../../../../shared/theme';
import { NOTIFICATIONS } from '../../../../data/mockData';

const TABS = ['Tous', 'Mises à jour', 'Échéances'];

export default function AgentNotificationsScreen({ navigation }) {
  const [tab, setTab] = useState('Tous');
  const [notifs, setNotifs] = useState(NOTIFICATIONS.agent);

  const filtered = tab === 'Tous' ? notifs
    : tab === 'Échéances' ? notifs.filter((n) => n.tab === 'Deadlines')
    : notifs.filter((n) => n.tab === 'Updates');

  const markRead = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()}
        right={<TouchableOpacity onPress={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}><Text style={{ fontSize: 12, fontWeight: '700', color: Colors.blue600 }}>Tout lire</Text></TouchableOpacity>}
      />
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
        renderItem={({ item }) => <NotifCard item={item} onPress={() => markRead(item.id)} />}
        ListEmptyComponent={<EmptyState icon="🔔" title="Aucune notification" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.gray400 },
  tabTextActive: { color: Colors.blue800, fontWeight: '800' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2.5, backgroundColor: Colors.blue800, borderRadius: 2 },
});
