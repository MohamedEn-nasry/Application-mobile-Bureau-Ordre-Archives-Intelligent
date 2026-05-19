import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// IPA: /e.saIn.d meI.l/ - Assigned Mail (pronounced "e-signed mail")
// IPA: /aI.tEm/ - Item (pronounced "eye-tem")
// IPA: /ste.tEs/ - Status (pronounced "stay-tus")

interface Props {
  reference: string;
  title: string;
  sender: string;
  status: string;
  date: string;
  onPress: () => void;
}

export const AssignedMailItem: React.FC<Props> = ({
  reference,
  title,
  sender,
  status,
  date,
  onPress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
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
    switch (status.toLowerCase()) {
      case 'in progress':
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
          <Text style={styles.reference}>{reference}</Text>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.sender}>{sender}</Text>
        </View>
        
        <View style={styles.rightContent}>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={getStatusIcon(status)} 
              size={16} 
              color={getStatusColor(status)} 
            />
            <Text style={[styles.status, { color: getStatusColor(status) }]}>
              {status}
            </Text>
          </View>
          <Text style={styles.date}>{date}</Text>
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
  title: {
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
