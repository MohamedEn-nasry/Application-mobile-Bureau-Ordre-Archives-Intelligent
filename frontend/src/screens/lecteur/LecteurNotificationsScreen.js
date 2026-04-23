// src/screens/lecteur/LecteurNotificationsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, NotifCard, EmptyState } from '../../components';
import { Colors, Spacing } from '../../theme';
import { NOTIFICATIONS } from '../../data/mockData';

const TABS = ['Tous', 'Mises à jour', 'Rappels'];

export default function LecteurNotificationsScreen({ navigation }) {
  const [tab, setTab] = useState('Tous');
  const [notifs, setNotifs] = useState(NOTIFICATIONS.lecteur);

  const filtered = tab === 'Tous' ? notifs
    : tab === 'Rappels' ? notifs.filter((n) => n.tab === 'Reminders')
    : notifs.filter((n) => n.tab === 'Updates');

  const markRead = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScreenHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        right={
          unreadCount > 0
            ? <TouchableOpacity onPress={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}><Text style={styles.markRead}>Tout lire</Text></TouchableOpacity>
            : null
        }
      />

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <View style={styles.unreadDot} />
          <Text style={styles.unreadText}>{unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

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
          <NotifCard
            item={item}
            onPress={() => {
              markRead(item.id);
              if (item.type === 'mail' || item.type === 'success') {
                navigation.navigate('LecteurMail');
              }
            }}
          />
        )}
        ListEmptyComponent={<EmptyState icon="🔔" title="Aucune notification" subtitle="Tout est à jour." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  markRead: { fontSize: 12, fontWeight: '700', color: Colors.teal600 },
  unreadBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.teal50, paddingHorizontal: Spacing.lg, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: Colors.teal100 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.teal400 },
  unreadText: { fontSize: 12, fontWeight: '600', color: Colors.teal700 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.gray400 },
  tabTextActive: { color: Colors.teal700, fontWeight: '800' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2.5, backgroundColor: Colors.teal600, borderRadius: 2 },
});
