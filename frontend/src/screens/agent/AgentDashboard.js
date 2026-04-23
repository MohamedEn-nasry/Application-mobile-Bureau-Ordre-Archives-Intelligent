// src/screens/agent/AgentDashboard.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, SearchBar, StatCard, SectionTitle, NotifCard, QuickActionButton, MailCard, IconButton, Card, OCRBox } from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { NOTIFICATIONS, INCOMING_MAIL, OUTGOING_MAIL } from '../../data/mockData';

const QUICK_ACTIONS = [
  { icon: '📥', label: 'Ajouter\nEntrant',  screen: 'AgentAddIncoming', color: Colors.blue600  },
  { icon: '📤', label: 'Ajouter\nSortant',  screen: 'AgentAddOutgoing', color: Colors.teal600  },
  { icon: '📷', label: 'Scanner\nDocument', screen: 'AgentScan',        color: Colors.purple600 },
  { icon: '🔍', label: 'Lancer\nOCR',       screen: 'AgentOCR',         color: Colors.amber600  },
];

export default function AgentDashboard({ navigation }) {
  const { currentUser } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const assigned = INCOMING_MAIL.filter((m) => m.assignedTo === currentUser?.fullName && m.status !== 'Archived');
  const pendingCount = assigned.filter((m) => m.status === 'Pending' || m.status === 'Urgent').length;
  const lastOCR = INCOMING_MAIL.find((m) => m.ocrText);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppBar
        title="Bureau d'Ordre"
        subtitle="Espace de travail agent"
        right={<IconButton icon="🔔" badge={2} onPress={() => navigation.navigate('AgentNotifications')} />}
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
          <TouchableOpacity style={styles.profilePill} onPress={() => navigation.navigate('AgentProfile')}>
            <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{currentUser?.initials}</Text></View>
          </TouchableOpacity>
        </View>

        {/* Alert banner if urgent */}
        {INCOMING_MAIL.filter((m) => m.status === 'Urgent' && m.assignedTo === currentUser?.fullName).length > 0 && (
          <TouchableOpacity style={styles.urgentBanner} onPress={() => navigation.navigate('Incoming')}>
            <Text style={styles.urgentIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentTitle}>Courrier urgent en attente</Text>
              <Text style={styles.urgentSub}>Appuyez pour consulter</Text>
            </View>
            <Text style={styles.urgentChevron}>›</Text>
          </TouchableOpacity>
        )}

        <SearchBar placeholder="Rechercher un courrier…" />

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Entrant" value={String(INCOMING_MAIL.length)} accent onPress={() => navigation.navigate('Incoming')} />
          <StatCard label="Sortant" value={String(OUTGOING_MAIL.length)} color={Colors.teal600} onPress={() => navigation.navigate('Outgoing')} />
          <StatCard label="Tâches en attente" value={String(pendingCount)} color={Colors.amber400} />
          <StatCard label="Scans récents" value="4" color={Colors.purple600} onPress={() => navigation.navigate('AgentScan')} />
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

        {/* Assigned mail */}
        <SectionTitle title="Courrier assigné" action={`${assigned.length} total`} />
        {assigned.slice(0, 3).map((mail) => (
          <MailCard key={mail.id} item={mail} type="incoming" onPress={() => navigation.navigate('AgentIncomingDetail', { mail })} />
        ))}
        {assigned.length === 0 && (
          <View style={styles.emptyAssigned}>
            <Text style={styles.emptyAssignedText}>Aucun courrier assigné pour l'instant.</Text>
          </View>
        )}

        {/* OCR Preview */}
        {lastOCR && (
          <View>
            <SectionTitle title="Dernier résultat OCR" action="Voir →" onAction={() => navigation.navigate('AgentOCR')} />
            <View style={styles.ocrPreviewWrap}>
              <Text style={styles.ocrPreviewRef}>{lastOCR.reference}</Text>
              <OCRBox text={lastOCR.ocrText.split('\n').slice(0, 3).join('\n') + '\n…'} />
            </View>
          </View>
        )}

        {/* Notifications preview */}
        <SectionTitle title="Activité récente" action="Tout voir" onAction={() => navigation.navigate('AgentNotifications')} />
        {NOTIFICATIONS.agent.filter((n) => !n.read).slice(0, 2).map((n) => (
          <NotifCard key={n.id} item={n} onPress={() => navigation.navigate('AgentNotifications')} />
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
  urgentBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.red50, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.red100 },
  urgentIcon: { fontSize: 20 },
  urgentTitle: { fontSize: 13, fontWeight: '800', color: Colors.red700 },
  urgentSub: { fontSize: 11, color: Colors.red400, marginTop: 1 },
  urgentChevron: { fontSize: 22, color: Colors.red300 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  qaGrid: { flexDirection: 'row', marginTop: Spacing.sm },
  emptyAssigned: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.xl, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  emptyAssignedText: { fontSize: 13, color: Colors.gray400 },
  ocrPreviewWrap: { gap: 4 },
  ocrPreviewRef: { fontSize: 10, fontWeight: '800', color: Colors.blue600, fontFamily: 'monospace', letterSpacing: 0.4, marginBottom: 2 },
});
