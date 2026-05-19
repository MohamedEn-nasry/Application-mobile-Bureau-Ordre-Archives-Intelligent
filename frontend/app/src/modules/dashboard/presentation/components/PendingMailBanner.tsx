import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  pendingCount: number;
  onPress?: () => void;
}

/**
 * PendingMailBanner
 * An amber alert banner shown when there are pending mail items.
 * Hidden automatically when pendingCount === 0.
 */
export const PendingMailBanner: React.FC<Props> = ({ pendingCount, onPress }) => {
  if (pendingCount === 0) return null;

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>⏳</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {pendingCount} courrier{pendingCount > 1 ? 's' : ''} en attente
        </Text>
        <Text style={styles.subtitle}>Nécessitent une action immédiate</Text>
      </View>
      <TouchableOpacity style={styles.cta} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.ctaText}>Voir</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: 14,
    gap: 12,
    elevation: 1,
    shadowColor: '#92400E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 18,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  subtitle: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  cta: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexShrink: 0,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
