import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useUsersList } from '../hooks/useUsersList';

export const UsersListScreen = ({ navigation }: any) => {
  const { users, isLoading, error, refetch } = useUsersList();

  if (isLoading) return <ActivityIndicator size="large" style={styles.loader} />;

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Add New User" onPress={() => navigation?.navigate('CreateUser')} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.email}>{item.email}</Text>
            <Text>Role: {item.role}</Text>
            <Text>Status: {item.active ? 'Active' : 'Inactive'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  loader: { flex: 1, justifyContent: 'center' },
  error: { color: 'red', textAlign: 'center', margin: 20 },
  card: { padding: 15, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, elevation: 1 },
  email: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 }
});
