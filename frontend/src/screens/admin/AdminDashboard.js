// src/screens/admin/AdminDashboard.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppBar, SearchBar, StatCard, SectionTitle, NotifCard,
  QuickActionButton, MailCard, IconButton, Card,
} from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { NOTIFICATIONS, INCOMING_MAIL, ANALYTICS } from '../../data/mockData';

const QUICK_ACTIONS = [
  { icon: '👥', label: 'Gérer\nUtilisateurs', screen: 'AdminUsers',    color: Colors.purple600 },
  { icon: '🔑', label: 'Assigner\nRôles',       screen: 'AdminRoles',    color: Colors.blue600   },
  { icon: '📨', label: 'Tout le\nCourrier',      screen: 'Mail',         color: Colors.teal600   },
  { icon: '📊', label: 'Rapports',               screen: 'AdminReports',  color: Colors.amber600  },
  { icon: '⚙️', label: 'Paramètres\nSystème',   screen: 'AdminSettings', color: Colors.gray600   },
];

export default function AdminDashboard({ navigation }) {
  const { currentUser } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const s = ANALYTICS.summary;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppBar
        title="Bureau d'Ordre"
        subtitle="Tableau de bord administrateur"
        right={
          <>
            <IconButton icon="🔔" badge={2} onPress={() => navigation.navigate('AdminNotifications')} />
            <IconButton icon="☰" onPress={() => navigation.navigate('AdminProfile')} />
          </>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>{greeting}, {currentUser?.fullName?.split(' ')[0]} 👋</Text>
            <Text style={styles.greetingDate}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity style={styles.profilePill} onPress={() => navigation.navigate('AdminProfile')}>
            <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{currentUser?.initials}</Text></View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar placeholder="Rechercher courrier, utilisateurs, documents…" />

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Courrier entrant" value={String(s.totalIncoming)} accent onPress={() => navigation.navigate('Mail')} />
          <StatCard label="Courrier sortant" value={String(s.totalOutgoing)} color={Colors.teal600} onPress={() => navigation.navigate('Mail')} />
          <StatCard label="En attente" value={String(s.pending)} color={Colors.amber400} onPress={() => navigation.navigate('Mail')} />
          <StatCard label="Archivés" value={String(s.archived)} color={Colors.gray500} />
        </View>

        {/* Total users */}
        <View style={styles.usersStatRow}>
          <View style={styles.usersStat}>
            <Text style={styles.usersStatNum}>{s.totalUsers}</Text>
            <Text style={styles.usersStatLabel}>Utilisateurs actifs</Text>
          </View>
          <TouchableOpacity style={styles.usersStatBtn} onPress={() => navigation.navigate('AdminUsers')}>
            <Text style={styles.usersStatBtnText}>Gérer les utilisateurs →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Card>
          <SectionTitle title="Actions rapides" />
          <View style={styles.qaGrid}>
            {QUICK_ACTIONS.map((a) => (
              <QuickActionButton key={a.label} icon={a.icon} label={a.label} color={a.color} onPress={() => navigation.navigate(a.screen)} />
            ))}
          </View>
        </Card>

        {/* Analytics mini chart */}
        <Card>
          <SectionTitle title="Aperçu mensuel" action="Voir tout" onAction={() => navigation.navigate('AdminReports')} />
          <View style={styles.chartArea}>
            {ANALYTICS.monthlyMail.map((d) => {
              const maxH = 70;
              const maxVal = 80;
              return (
                <View key={d.month} style={styles.barGroup}>
                  <View style={styles.barPair}>
                    <View style={[styles.bar, styles.barIn, { height: (d.incoming / maxVal) * maxH }]} />
                    <View style={[styles.bar, styles.barOut, { height: (d.outgoing / maxVal) * maxH }]} />
                  </View>
                  <Text style={styles.barLabel}>{d.month}</Text>
                </View>
              );
            })}
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.blue400 }]} /><Text style={styles.legendText}>Entrant</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.teal400 }]} /><Text style={styles.legendText}>Sortant</Text></View>
            </View>
          </View>
        </Card>

        {/* Recent Activity */}
        <SectionTitle title="Activité récente" action="Tout voir" onAction={() => navigation.navigate('AdminNotifications')} />
        {NOTIFICATIONS.admin.filter((n) => !n.read).slice(0, 3).map((n) => (
          <NotifCard key={n.id} item={n} onPress={() => navigation.navigate('AdminNotifications')} />
        ))}

        {/* Recent incoming mail */}
        <SectionTitle title="Derniers courriers entrants" action="Voir tout" onAction={() => navigation.navigate('Mail')} />
        {INCOMING_MAIL.slice(0, 3).map((mail) => (
          <MailCard key={mail.id} item={mail} type="incoming" onPress={() => navigation.navigate('AdminMailDetail', { mail })} />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 32 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingText: { fontSize: 20, fontWeight: '800', color: Colors.blue900, letterSpacing: -0.2 },
  greetingDate: { fontSize: 12, color: Colors.gray400, marginTop: 2 },
  profilePill: { ...Shadow.sm },
  profileAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.blue800, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  usersStatRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 0.5, borderColor: Colors.border, ...Shadow.xs },
  usersStat: { flex: 1 },
  usersStatNum: { fontSize: 28, fontWeight: '800', color: Colors.blue800, letterSpacing: -0.5 },
  usersStatLabel: { fontSize: 11, fontWeight: '600', color: Colors.gray400, marginTop: 2 },
  usersStatBtn: { backgroundColor: Colors.blue50, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 0.5, borderColor: Colors.blue100 },
  usersStatBtnText: { fontSize: 12, fontWeight: '700', color: Colors.blue700 },
  qaGrid: { flexDirection: 'row', marginTop: Spacing.sm },
  chartArea: { marginTop: Spacing.sm, position: 'relative' },
  barGroup: { flex: 1, alignItems: 'center' },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 70, marginBottom: 6 },
  bar: { width: 12, borderRadius: 3 },
  barIn: { backgroundColor: Colors.blue400 },
  barOut: { backgroundColor: Colors.teal400 },
  barLabel: { fontSize: 10, color: Colors.gray500, fontWeight: '600' },
  chartLegend: { flexDirection: 'row', gap: 16, marginTop: 10, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.gray500 },
});
