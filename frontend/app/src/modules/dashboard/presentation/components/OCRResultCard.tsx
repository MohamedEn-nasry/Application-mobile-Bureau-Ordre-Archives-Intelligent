import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// IPA: /oU.si.ar rI.zVlt/ - OCR Result (pronounced "oh-see-ar ree-zult")
// IPA: /kArd/ - Card (pronounced "card")
// IPA: /kAn.fI.dEns/ - Confidence (pronounced "kon-fi-dens")

interface Props {
  reference: string;
  title: string;
  completionDate: string;
  content: string;
  confidence: number;
  onPress: () => void;
}

export const OCRResultCard: React.FC<Props> = ({
  reference,
  title,
  completionDate,
  content,
  confidence,
  onPress,
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10B981';
    if (confidence >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={20} color="#4F46E5" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.reference}>{reference}</Text>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidence, { color: getConfidenceColor(confidence) }]}>
            {confidence}% confidence
          </Text>
        </View>
      </View>
      
      <View style={styles.contentSection}>
        <Text style={styles.content} numberOfLines={2}>
          {content}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.completionDate}>
          OCR completed: {completionDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.03)',
    elevation: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  reference: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidence: {
    fontSize: 11,
    fontWeight: '600',
  },
  contentSection: {
    marginBottom: 12,
  },
  content: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  completionDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '400',
  },
});
