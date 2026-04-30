import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingToggle } from './SettingToggle';

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
});

interface SettingItemProps {
  label: string;
  description?: string;
  value?: string;
  type?: 'toggle' | 'selector' | 'info';
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
  isLast?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  value,
  type = 'info',
  toggleValue = false,
  onToggleChange,
  onPress,
  disabled = false,
  isLast = false,
}) => {
  const renderRightComponent = () => {
    switch (type) {
      case 'toggle':
        return (
          <SettingToggle
            value={toggleValue}
            onValueChange={onToggleChange || (() => {})}
            disabled={disabled}
          />
        );
      case 'selector':
        return (
          <View style={styles.toggleContainer}>
            <Text style={styles.settingValue}>{value}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666"
              style={styles.arrowIcon}
            />
          </View>
        );
      case 'info':
        return (
          <View style={styles.toggleContainer}>
            <Text style={styles.settingValue}>{value}</Text>
            {onPress && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666"
                style={styles.arrowIcon}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        isLast && styles.settingItemLast,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {renderRightComponent()}
    </TouchableOpacity>
  );
};
