import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusCard } from '../components/StatusCard';
import { InfoSection } from '../components/InfoSection';
import { SystemInfoProvider, useSystemInfo } from '../viewmodels/SystemInfoViewModel';

const SystemInfoContent: React.FC = () => {
  const { state, refreshData, clearError } = useSystemInfo();

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh system information');
    }
  };

  if (state.error) {
    Alert.alert('Error', state.error, [
      { text: 'Retry', onPress: handleRefresh },
      { text: 'Cancel', onPress: clearError },
    ]);
  }

  if (state.isLoading && !state.status && !state.config) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh" size={24} color="#6B7280" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={state.isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#6B7280"
        />
      }
    >
      {state.status && <StatusCard status={state.status} />}
      
      {state.config && <InfoSection config={state.config} />}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {new Date().toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export const SystemInfoScreen: React.FC = () => {
  return (
    <SystemInfoProvider>
      <SafeAreaView style={styles.safeArea}>
        <SystemInfoContent />
      </SafeAreaView>
    </SystemInfoProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  footer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
