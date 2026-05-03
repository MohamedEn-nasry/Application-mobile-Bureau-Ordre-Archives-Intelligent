import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  value: string | number | boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export const ConfigItem: React.FC<Props> = ({ 
  label, 
  value, 
  icon = 'information-circle', 
  color = '#6B7280' 
}) => {
  const formatValue = (val: string | number | boolean): string => {
    if (typeof val === 'boolean') {
      return val ? 'Enabled' : 'Disabled';
    }
    if (typeof val === 'number') {
      return val.toString();
    }
    return val;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={16} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{formatValue(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
});
