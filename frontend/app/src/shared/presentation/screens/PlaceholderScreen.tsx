import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface Props {
  navigation: any;
  route: { params?: { title?: string; icon?: string } };
}

/**
 * PlaceholderScreen
 * Shown for routes that exist in navigation but have no
 * dedicated screen implementation yet. Prevents crashes.
 */
export function PlaceholderScreen({ navigation, route }: Props) {
  const title = route.params?.title ?? 'En cours de développement';
  const icon  = route.params?.icon  ?? '🚧';

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{icon}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Cette fonctionnalité est en cours de développement.{'\n'}
          Elle sera disponible prochainement.
        </Text>

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>En développement</Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="#2563EB" />
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },

  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconEmoji: { fontSize: 42 },

  title: { fontSize: 20, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#D97706' },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  backBtnText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
});
