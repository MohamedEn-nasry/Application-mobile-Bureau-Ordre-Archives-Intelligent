import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConfigItem } from './ConfigItem';
import { SystemConfig } from '../../domain/entities/SystemConfig';

interface Props {
  config: SystemConfig;
}

export const InfoSection: React.FC<Props> = ({ config }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Configuration</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Information</Text>
        <ConfigItem 
          label="API Version" 
          value={config.apiVersion} 
          icon="code-working" 
        />
        <ConfigItem 
          label="Environment" 
          value={config.environment.toUpperCase()} 
          icon="layers" 
        />
        <ConfigItem 
          label="Build Number" 
          value={config.buildNumber} 
          icon="build" 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Database Configuration</Text>
        <ConfigItem 
          label="Database Type" 
          value={config.database.type} 
          icon="server" 
        />
        <ConfigItem 
          label="Max Connections" 
          value={config.database.maxConnections} 
          icon="link" 
        />
        <ConfigItem 
          label="Current Connections" 
          value={config.database.currentConnections} 
          icon="wifi" 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Settings</Text>
        <ConfigItem 
          label="JWT Expiration" 
          value={`${config.auth.jwtExpirationHours} hours`} 
          icon="time" 
        />
        <ConfigItem 
          label="Email Verification" 
          value={config.auth.requireEmailVerification} 
          icon="mail" 
        />
        <ConfigItem 
          label="Max Login Attempts" 
          value={config.auth.maxLoginAttempts} 
          icon="lock-closed" 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Flags</Text>
        {config.features.map((feature, index) => (
          <ConfigItem 
            key={index}
            label={feature.name} 
            value={feature.enabled} 
            icon={feature.enabled ? 'checkmark-circle' : 'close-circle'} 
            color={feature.enabled ? '#10B981' : '#EF4444'}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CORS Origins</Text>
        {config.corsOrigins.map((origin, index) => (
          <ConfigItem 
            key={index}
            label={`Origin ${index + 1}`} 
            value={origin} 
            icon="globe" 
          />
        ))}
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
