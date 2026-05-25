import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';

interface Category {
  id: string | number;
  Nom: string;
  Description?: string;
}

interface CategorieSelectorModalProps {
  visible: boolean;
  categories: Category[];
  selectedCategoryId: number | null | undefined;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export const CategorieSelectorModal = ({
  visible,
  categories,
  selectedCategoryId,
  onSelect,
  onClose
}: CategorieSelectorModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Choisir une catégorie</Text>

          <ScrollView style={styles.modalList}>
            {categories.length > 0 ? (
              categories.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.categorieOption,
                    Number(item.id) === Number(selectedCategoryId) &&
                    styles.categorieOptionActive,
                  ]}
                  onPress={() => {
                    onSelect(Number(item.id));
                    onClose();
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categorieName}>{item.Nom}</Text>
                    {item.Description ? (
                      <Text style={styles.categorieDescription}>
                        {item.Description}
                      </Text>
                    ) : null}
                  </View>

                  {Number(item.id) === Number(selectedCategoryId) ? (
                    <Text style={styles.checkMark}>✓</Text>
                  ) : null}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyCategorie}>
                Aucune catégorie disponible.
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalList: {
    maxHeight: 400
  },
  categorieOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  categorieOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  },
  categorieName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b'
  },
  categorieDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4
  },
  checkMark: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '800',
    marginLeft: 10
  },
  emptyCategorie: {
    textAlign: 'center',
    color: '#64748b',
    padding: 20
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center'
  },
  modalCloseText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '700'
  }
});
