// src/screens/lecteur/LecteurDashboard.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, SearchBar, StatCard, SectionTitle, NotifCard, MailCard, IconButton, Card, QuickActionButton } from '../../../../shared/components';
import { Colors, Spacing, Radius, Shadow } from '../../../../shared/theme';
import { useAuth } from '../../../../context/AuthContext';
import { NOTIFICATIONS, INCOMING_MAIL, ANALYTICS } from '../../../../data/mockData';

const QUICK_ACTIONS = [
  { icon: '🔍', label: 'Rechercher\nCourrier',  screen: 'LecteurSearch',  color: Colors.blue600  },
  { icon: '📨', label: 'Voir les\ndocuments',  screen: 'LecteurMail',    color: Colors.teal600  },
  { icon: '📂', label: 'Ouvrir\nl\'archive',   screen: 'LecteurArchive', color: Colors.gray600  },
];

export default function LecteurDashboard({ navigation }) {
  const { currentUser } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const s = ANALYTICS.summary;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppBar
        title="Bureau d'Ordre"
        subtitle="Consultation uniquement"
        right={<IconButton icon="🔔" badge={1} onPress={() => navigation.navigate('LecteurNotifications')} />}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>{greeting}, {currentUser?.fullName?.split(' ')[0]} 👋</Text>
            <Text style={styles.greetingDate}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
          <TouchableOpacity style={styles.profilePill} onPress={() => navigation.navigate('LecteurProfile')}>
            <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{currentUser?.initials}</Text></View>
          </TouchableOpacity>
        </View>

        {/* Read-only indicator */}
        <View style={styles.readOnlyPill}>
          <View style={styles.readOnlyDot} />
          <Text style={styles.readOnlyText}>Mode consultation — lecture seule</Text>
        </View>

        <SearchBar placeholder="Rechercher courrier, documents…" onPress={() => navigation.navigate('LecteurSearch')} />

        <View style={styles.statsGrid}>
          <StatCard label="Courrier entrant" value={String(s.totalIncoming)} accent />
          <StatCard label="Courrier sortant" value={String(s.totalOutgoing)} color={Colors.teal600} />
          <StatCard label="Archivés" value={String(s.archived)} color={Colors.gray500} />
          <StatCard label="Mises à jour" value="3" color={Colors.amber400} />
        </View>

        <Card>
          <SectionTitle title="Accès rapide" />
          <View style={styles.qaGrid}>
            {QUICK_ACTIONS.map((a) => (
              <QuickActionButton key={a.label} icon={a.icon} label={a.label} color={a.color} onPress={() => navigation.navigate(a.screen)} />
            ))}
          </View>
        </Card>

        <SectionTitle title="Documents récents" action="Voir tout" onAction={() => navigation.navigate('LecteurMail')} />
        {INCOMING_MAIL.slice(0, 3).map((mail) => (
          <MailCard key={mail.id} item={mail} type="incoming" onPress={() => navigation.navigate('LecteurMailDetail', { mail })} />
        ))}

        <SectionTitle title="Dernières mises à jour" action="Tout voir" onAction={() => navigation.navigate('LecteurNotifications')} />
        {NOTIFICATIONS.lecteur.slice(0, 2).map((n) => <NotifCard key={n.id} item={n} onPress={() => navigation.navigate('LecteurNotifications')} />)}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 32 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingText: { fontSize: 20, fontWeight: '800', color: Colors.blue900 },
  greetingDate: { fontSize: 12, color: Colors.gray400, marginTop: 2 },
  profilePill: { ...Shadow.sm },
  profileAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.teal600, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  readOnlyPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.teal50, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.teal100 },
  readOnlyDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.teal400 },
  readOnlyText: { fontSize: 12, fontWeight: '600', color: Colors.teal700 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  qaGrid: { flexDirection: 'row', marginTop: Spacing.sm },
});
