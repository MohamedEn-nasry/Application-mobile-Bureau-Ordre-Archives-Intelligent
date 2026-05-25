import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RecentOcrResultItem } from '../../domain/entities/AgentDashboard';

export const OcrResultCard: React.FC<{
  item: RecentOcrResultItem;
  onPress: () => void;
}> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>
        {item.reference} – {item.title}
      </Text>

      <Text style={styles.subtitle}>OCR completed • {item.dateLabel}</Text>

      <Text style={styles.excerpt} numberOfLines={3}>
        {item.excerpt}
      </Text>

      <Text style={styles.confidence}>↗ {item.confidence}% confidence</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: '#94A3B8',
    fontSize: 13,
  },
  excerpt: {
    marginTop: 12,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  confidence: {
    marginTop: 14,
    color: '#10B981',
    fontWeight: '700',
  },
});