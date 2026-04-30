import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SettingItem } from './SettingItem';

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionHeaderPurple: {
    backgroundColor: '#7c3aed',
  },
  sectionHeaderGreen: {
    backgroundColor: '#10b981',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitleWhite: {
    color: 'white',
  },
});

interface SettingsSectionProps {
  title: string;
  titleColor?: 'default' | 'white';
  headerColor?: 'default' | 'purple' | 'green';
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  titleColor = 'default',
  headerColor = 'default',
  children,
}) => {
  const getHeaderStyle = () => {
    switch (headerColor) {
      case 'purple':
        return [styles.sectionHeader, styles.sectionHeaderPurple];
      case 'green':
        return [styles.sectionHeader, styles.sectionHeaderGreen];
      default:
        return styles.sectionHeader;
    }
  };

  const getTitleStyle = () => {
    switch (titleColor) {
      case 'white':
        return [styles.sectionTitle, styles.sectionTitleWhite];
      default:
        return styles.sectionTitle;
    }
  };

  return (
    <View style={styles.section}>
      <View style={getHeaderStyle()}>
        <Text style={getTitleStyle()}>{title}</Text>
      </View>
      {children}
    </View>
  );
};
