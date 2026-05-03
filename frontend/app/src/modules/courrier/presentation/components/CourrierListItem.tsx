import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutgoingCourrier, CourrierStatus, CourrierPriority } from '../../domain/entities/OutgoingCourrier';

interface Props {
  courrier: OutgoingCourrier;
  onPress: (courrier: OutgoingCourrier) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: CourrierStatus): string => {
  switch (status) {
    case CourrierStatus.DRAFT:
      return '#94A3B8';
    case CourrierStatus.PENDING:
      return '#F59E0B';
    case CourrierStatus.SENT:
      return '#3B82F6';
    case CourrierStatus.DELIVERED:
      return '#10B981';
    case CourrierStatus.ARCHIVED:
      return '#6B7280';
    case CourrierStatus.CANCELLED:
      return '#EF4444';
    default:
      return '#94A3B8';
  }
};

const getPriorityIcon = (priority: CourrierPriority): string => {
  switch (priority) {
    case CourrierPriority.URGENT:
      return 'alert-circle';
    case CourrierPriority.HIGH:
      return 'arrow-up-circle';
    case CourrierPriority.NORMAL:
      return 'ellipse';
    case CourrierPriority.LOW:
      return 'arrow-down-circle';
    default:
      return 'ellipse';
  }
};

const getPriorityColor = (priority: CourrierPriority): string => {
  switch (priority) {
    case CourrierPriority.URGENT:
      return '#DC2626';
    case CourrierPriority.HIGH:
      return '#EA580C';
    case CourrierPriority.NORMAL:
      return '#059669';
    case CourrierPriority.LOW:
      return '#0891B2';
    default:
      return '#059669';
  }
};

export const CourrierListItem: React.FC<Props> = ({
  courrier,
  onPress,
  isLoading = false,
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusColor = getStatusColor(courrier.status);
  const priorityIcon = getPriorityIcon(courrier.priority);
  const priorityColor = getPriorityColor(courrier.priority);

  const getContainerStyle = () => {
    switch (courrier.priority) {
      case CourrierPriority.URGENT:
        return [styles.container, styles.containerUrgent];
      case CourrierPriority.HIGH:
        return [styles.container, styles.containerHigh];
      case CourrierPriority.NORMAL:
        return [styles.container, styles.containerNormal];
      case CourrierPriority.LOW:
        return [styles.container, styles.containerLow];
      default:
        return styles.container;
    }
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={() => onPress(courrier)}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.referenceContainer}>
          <Text style={styles.reference}>{courrier.reference}</Text>
          <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}>
            <Ionicons name={priorityIcon as any} size={12} color="#FFFFFF" />
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{courrier.status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.recipient}>
          <Text style={styles.recipientLabel}>Destinataire:</Text>
          <Text numberOfLines={1}>{courrier.recipient}</Text>
        </View>
        <Text style={styles.subject} numberOfLines={2}>
          {courrier.subject}
        </Text>
        {courrier.description && (
          <Text style={styles.description} numberOfLines={3}>
            {courrier.description}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" style={styles.dateIcon} />
          <Text style={styles.date}>{formatDate(courrier.dateSent)}</Text>
        </View>
        <View style={styles.actions}>
          {courrier.attachments && courrier.attachments.length > 0 && (
            <View style={styles.attachmentIndicator}>
              <Ionicons name="attach" size={14} color="#6B7280" />
              <Text style={styles.attachmentCount}>
                {courrier.attachments.length}
              </Text>
            </View>
          )}
          {isLoading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <View style={styles.quickAction}>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  containerUrgent: {
    borderLeftColor: '#DC2626',
  },
  containerHigh: {
    borderLeftColor: '#F59E0B',
  },
  containerNormal: {
    borderLeftColor: '#10B981',
  },
  containerLow: {
    borderLeftColor: '#0891B2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reference: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  priorityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    marginBottom: 16,
  },
  recipient: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginRight: 4,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attachmentCount: {
    fontSize: 11,
    color: '#374151',
    marginLeft: 4,
    fontWeight: '600',
  },
  quickAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
