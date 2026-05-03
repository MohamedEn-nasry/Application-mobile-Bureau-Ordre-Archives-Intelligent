import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourrierFilter, CourrierFilterBuilder } from '../../domain/entities/CourrierFilter';
import { CourrierStatus, CourrierPriority } from '../../domain/entities/OutgoingCourrier';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filter: CourrierFilter) => void;
  currentFilter?: CourrierFilter;
}

const statusOptions = Object.values(CourrierStatus);
const priorityOptions = Object.values(CourrierPriority);

export const CourrierFilterPanel: React.FC<Props> = ({
  visible,
  onClose,
  onApplyFilter,
  currentFilter,
}) => {
  const [recipient, setRecipient] = useState(currentFilter?.recipient || '');
  const [subject, setSubject] = useState(currentFilter?.subject || '');
  const [selectedStatus, setSelectedStatus] = useState<CourrierStatus | undefined>(
    currentFilter?.status
  );
  const [selectedPriority, setSelectedPriority] = useState<CourrierPriority | undefined>(
    currentFilter?.priority
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    currentFilter?.dateRange?.startDate
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    currentFilter?.dateRange?.endDate
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilter = async () => {
    setIsLoading(true);
    
    const filterBuilder = new CourrierFilterBuilder()
      .withRecipient(recipient.trim())
      .withSubject(subject.trim())
      .withStatus(selectedStatus)
      .withPriority(selectedPriority);

    if (startDate && endDate) {
      filterBuilder.withDateRange(startDate, endDate);
    }

    const filter = filterBuilder.build();
    
    onApplyFilter(filter);
    setIsLoading(false);
    onClose();
  };

  const handleResetFilter = () => {
    setRecipient('');
    setSubject('');
    setSelectedStatus(undefined);
    setSelectedPriority(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtrer le Courrier</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destinataire</Text>
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Rechercher par destinataire..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sujet</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Rechercher par sujet..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date d&apos;envoi</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  // TODO: Implement date picker
                }}
              >
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text style={styles.dateText}>
                  {startDate ? formatDate(startDate) : 'Date de début'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  // TODO: Implement date picker
                }}
              >
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text style={styles.dateText}>
                  {endDate ? formatDate(endDate) : 'Date de fin'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statut</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.optionButton,
                      selectedStatus === status && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedStatus(
                      selectedStatus === status ? undefined : status
                    )}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedStatus === status && styles.selectedOptionText,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priorité</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {priorityOptions.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.optionButton,
                      selectedPriority === priority && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedPriority(
                      selectedPriority === priority ? undefined : priority
                    )}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedPriority === priority && styles.selectedOptionText,
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetFilter}
          >
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyButton, isLoading && styles.disabledButton]}
            onPress={handleApplyFilter}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.applyButtonText}>Appliquer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
