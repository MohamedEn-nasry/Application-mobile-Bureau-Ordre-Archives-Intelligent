import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OutgoingCourrier, CourrierStatus, CourrierPriority } from '../../domain/entities/OutgoingCourrier';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';

interface Props {
  navigation: any;
  route: any;
}

export const CreateCourrierScreen: React.FC<Props> = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    description: '',
    priority: CourrierPriority.NORMAL,
    type: 'outgoing' as 'outgoing' | 'incoming',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Le destinataire est requis';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual API call to create courrier
      const newCourrier: OutgoingCourrier = {
        id: Date.now().toString(),
        reference: `REF-${Date.now()}`,
        recipient: formData.recipient,
        subject: formData.subject,
        description: formData.description,
        dateSent: new Date(),
        status: CourrierStatus.DRAFT,
        priority: formData.priority,
        type: formData.type,
        createdBy: 'Current User',
        attachments: [],
      };

      // Simulate success
      Alert.alert(
        'Succès',
        'Le courrier a été créé avec succès',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
      
      // Reset form
      setFormData({
        recipient: '',
        subject: '',
        description: '',
        priority: CourrierPriority.NORMAL,
        type: 'outgoing',
      });
      setErrors({});
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erreur', 'Échec de la création du courrier');
    }
  };

  const handleAddAttachment = () => {
    // TODO: Implement attachment functionality
    Alert.alert('Info', 'Fonctionnalité des pièces jointes bientôt disponible');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau Courrier</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Type de courrier</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeOption, formData.type === 'outgoing' && styles.selectedType]}
              onPress={() => setFormData({ ...formData, type: 'outgoing' })}
            >
              <Text style={[styles.typeText, formData.type === 'outgoing' && styles.selectedTypeText]}>
                Sortant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeOption, formData.type === 'incoming' && styles.selectedType]}
              onPress={() => setFormData({ ...formData, type: 'incoming' })}
            >
              <Text style={[styles.typeText, formData.type === 'incoming' && styles.selectedTypeText]}>
                Entrant
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Destinataire</Text>
          <TextInput
            style={[styles.input, errors.recipient && styles.inputError]}
            placeholder="Nom ou email du destinataire..."
            placeholderTextColor="#94A3B8"
            value={formData.recipient}
            onChangeText={(text) => setFormData({ ...formData, recipient: text })}
          />
          {errors.recipient && (
            <Text style={styles.errorText}>{errors.recipient}</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Sujet</Text>
          <TextInput
            style={[styles.input, errors.subject && styles.inputError]}
            placeholder="Sujet du courrier..."
            placeholderTextColor="#94A3B8"
            value={formData.subject}
            onChangeText={(text) => setFormData({ ...formData, subject: text })}
          />
          {errors.subject && (
            <Text style={styles.errorText}>{errors.subject}</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            placeholder="Description détaillée..."
            placeholderTextColor="#94A3B8"
            multiline
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Priorité</Text>
          <View style={styles.prioritySelector}>
            {Object.values(CourrierPriority).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityOption,
                  formData.priority === priority && styles.selectedPriority
                ]}
                onPress={() => setFormData({ ...formData, priority })}
              >
                <Text style={[
                  styles.priorityText,
                  formData.priority === priority && styles.selectedPriorityText
                ]}>
                  {priority === CourrierPriority.LOW && 'Faible'}
                  {priority === CourrierPriority.NORMAL && 'Normal'}
                  {priority === CourrierPriority.HIGH && 'Élevée'}
                  {priority === CourrierPriority.URGENT && 'Urgent'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <TouchableOpacity style={styles.attachmentButton} onPress={handleAddAttachment}>
            <Ionicons name="attach" size={20} color="#3B82F6" />
            <Text style={styles.attachmentButtonText}>Ajouter des pièces jointes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="courrier" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#3B82F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedTypeText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  selectedPriority: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedPriorityText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  attachmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
