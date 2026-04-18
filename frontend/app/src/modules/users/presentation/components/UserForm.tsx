import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Role, Roles } from '../../../../shared/constants/roles';

interface UserFormProps {
  onSubmit: (email: string, role: Role, password?: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const UserForm = ({ onSubmit, isLoading, error }: UserFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Roles.AGENT);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="User Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Initial Password (Optional)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Simple Role Toggles for demonstration (a Picker would be better) */}
      <View style={styles.roleContainer}>
        {Object.values(Roles).map(r => (
          <Button 
            key={r} 
            title={r} 
            color={role === r ? 'blue' : 'gray'} 
            onPress={() => setRole(r as Role)} 
          />
        ))}
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Create User" onPress={() => onSubmit(email, role, password)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  error: { color: 'red', marginBottom: 15, textAlign: 'center' },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }
});
