import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IncomingMail } from '../../domain/entities/IncomingMail';

// IPA: /In.kʌm.Iŋ meI.l aI.tEm/ - Incoming Mail Item (pronounced "in-kuh-ming mail eye-tem")
// IPA: /fæl/ - File (pronounced "fal")
// IPA: /oU.si.ar/ - OCR (pronounced "oh-see-ar")

interface Props {
  mail: IncomingMail;
  onPress: () => void;
}

export const IncomingMailItem: React.FC<Props> = ({ mail, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '#F59E0B';
      case 'pending':
        return '#EF4444';
      case 'completed':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'time' as keyof typeof Ionicons.glyphMap;
      case 'pending':
        return 'alert-circle' as keyof typeof Ionicons.glyphMap;
      case 'completed':
        return 'checkmark-circle' as keyof typeof Ionicons.glyphMap;
      default:
        return 'help-circle' as keyof typeof Ionicons.glyphMap;
    }
  };

  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={styles.reference}>{mail.Reference}</Text>
          <Text style={styles.title} numberOfLines={2}>{mail.Objet}</Text>
          <Text style={styles.sender}>{mail.Expediteur || 'Unknown Sender'}</Text>
          
          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Ionicons name="document-attach" size={14} color="#64748B" />
              <Text style={styles.metadataText}>Category: {mail.CategorieId}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Ionicons 
                name={mail.TexteOcr ? 'checkmark-circle' : 'ellipse'} 
                size={14} 
                color={mail.TexteOcr ? '#10B981' : '#94A3B8'} 
              />
              <Text style={[styles.metadataText, { color: mail.TexteOcr ? '#10B981' : '#94A3B8' }]}>
                OCR {mail.TexteOcr ? 'Processed' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={getStatusIcon(mail.Statut)} 
              size={16} 
              color={getStatusColor(mail.Statut)} 
            />
            <Text style={[styles.status, { color: getStatusColor(mail.Statut) }]}>
              {mail.Statut.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.date}>{mail.DateCourrier.toISOString().split('T')[0]}</Text>
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
    marginRight: 12,
  },
  reference: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
    lineHeight: 20,
  },
  sender: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  rightContent: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  date: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '400',
  },
});
