import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SystemStatus, ServerStatus, DatabaseStatus, HealthStatus } from '../../domain/entities/SystemStatus';

interface Props {
  status: SystemStatus;
}

const getStatusColor = (status: ServerStatus | DatabaseStatus | HealthStatus): string => {
  switch (status) {
    case 'online':
    case 'connected':
    case 'healthy':
      return '#10B981';
    case 'offline':
    case 'disconnected':
    case 'critical':
      return '#EF4444';
    case 'maintenance':
    case 'warning':
    case 'error':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
};

const getStatusIcon = (status: ServerStatus | DatabaseStatus | HealthStatus): keyof typeof Ionicons.glyphMap => {
  switch (status) {
    case 'online':
    case 'connected':
      return 'checkmark-circle';
    case 'offline':
    case 'disconnected':
      return 'close-circle';
    case 'maintenance':
      return 'construct';
    case 'healthy':
      return 'heart';
    case 'warning':
      return 'warning';
    case 'critical':
    case 'error':
      return 'alert-circle';
    default:
      return 'help-circle';
  }
};

export const StatusCard: React.FC<Props> = ({ status }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Status</Text>
      
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Ionicons 
            name={getStatusIcon(status.serverStatus)} 
            size={20} 
            color={getStatusColor(status.serverStatus)} 
          />
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>Server</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(status.serverStatus) }]}>
              {status.serverStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <Ionicons 
            name={getStatusIcon(status.databaseStatus)} 
            size={20} 
            color={getStatusColor(status.databaseStatus)} 
          />
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>Database</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(status.databaseStatus) }]}>
              {status.databaseStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <Ionicons 
            name={getStatusIcon(status.apiHealth)} 
            size={20} 
            color={getStatusColor(status.apiHealth)} 
          />
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>API Health</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(status.apiHealth) }]}>
              {status.apiHealth.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Uptime</Text>
          <Text style={styles.metricValue}>{status.uptime}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Active Users</Text>
          <Text style={styles.metricValue}>{status.activeUsers}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Memory Usage</Text>
          <Text style={styles.metricValue}>{status.memoryUsage}%</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>CPU Usage</Text>
          <Text style={styles.metricValue}>{status.cpuUsage}%</Text>
        </View>
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusText: {
    alignItems: 'center',
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
