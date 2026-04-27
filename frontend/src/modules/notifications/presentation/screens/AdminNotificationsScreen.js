// src/screens/admin/AdminNotificationsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, NotifCard, EmptyState } from '../../../../shared/components';
import { Colors, Spacing } from '../../../../shared/theme';
import { NOTIFICATIONS } from '../../../../data/mockData';

const TABS = ['Tous', 'Système', 'Courrier', 'Sécurité'];
const TAB_FILTER = { 'Tous': null, 'Système': 'system', 'Courrier': 'mail', 'Sécurité': 'security' };

export default function AdminNotificationsScreen({ navigation }) {
  const [tab, setTab] = useState('Tous');
  const [notifs, setNotifs] = useState(NOTIFICATIONS.admin);

  const filtered = tab === 'Tous' ? notifs : notifs.filter((n) => n.type === TAB_FILTER[tab] || (tab === 'Courrier' && n.type === 'mail') || (tab === 'Système' && (n.type === 'system' || n.type === 'success')));

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    Alert.alert('Lu', 'Toutes les notifications ont été marquées comme lues.');
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        right={
          unreadCount > 0 ? (
            <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
              <Text style={styles.markReadText}>Tout marquer lu</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Unread count banner */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <View style={styles.unreadDot} />
          <Text style={styles.unreadText}>{unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      {/* Tabs */}
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
        renderItem={({ item }) => (
          <NotifCard item={item} onPress={() => setNotifs((prev) => prev.map((n) => n.id === item.id ? { ...n, read: true } : n))} />
        )}
        ListEmptyComponent={<EmptyState icon="🔔" title="Aucune notification" subtitle="Tout est à jour ici." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  markReadBtn: { backgroundColor: Colors.blue50, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.blue100 },
  markReadText: { fontSize: 11, fontWeight: '700', color: Colors.blue700 },
  unreadBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.blue50, paddingHorizontal: Spacing.lg, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: Colors.blue100 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.blue400 },
  unreadText: { fontSize: 12, fontWeight: '600', color: Colors.blue700 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.gray400 },
  tabTextActive: { color: Colors.blue800, fontWeight: '800' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2.5, backgroundColor: Colors.blue800, borderRadius: 2 },
});
