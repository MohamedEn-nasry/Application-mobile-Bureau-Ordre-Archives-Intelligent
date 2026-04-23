import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LoginParams } from '../../domain/usecases/LoginUseCase';
import { LoginState } from '../hooks/useLogin';

/**
 * LoginForm component props
 */
export interface LoginFormProps {
  onSubmit: (params: LoginParams) => void;
  loginState: LoginState;
  disabled?: boolean;
}

/**
 * Login form component
 * Dumb UI component that handles form input and submission
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loginState,
  disabled = false,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setIdentifierError('');
    setPasswordError('');

    // Validate identifier
    if (!identifier.trim()) {
      setIdentifierError('Email or username is required');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    if (validateForm() && !loginState.isLoading) {
      onSubmit({
        identifier: identifier.trim(),
        password,
      });
    }
  };

  /**
   * Handle input changes
   */
  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    if (identifierError) {
      setIdentifierError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
      {/* Error display */}
      {loginState.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{loginState.error}</Text>
        </View>
      )}

      {/* Identifier input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email ou Nom d'utilisateur</Text>
        <TextInput
          style={[
            styles.input,
            identifierError ? styles.inputError : {},
          ]}
          value={identifier}
          onChangeText={handleIdentifierChange}
          placeholder="Entrez votre email ou nom d'utilisateur"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loginState.isLoading && !disabled}
          onSubmitEditing={handleSubmit}
        />
        {identifierError ? (
          <Text style={styles.fieldErrorText}>{identifierError}</Text>
        ) : null}
      </View>

      {/* Password input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={[
            styles.input,
            passwordError ? styles.inputError : {},
          ]}
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          autoCapitalize="none"
          editable={!loginState.isLoading && !disabled}
          onSubmitEditing={handleSubmit}
        />
        {passwordError ? (
          <Text style={styles.fieldErrorText}>{passwordError}</Text>
        ) : null}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (loginState.isLoading || disabled) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loginState.isLoading || disabled}
      >
        <Text style={styles.submitButtonText}>
          {loginState.isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      {/* Forgot password link */}
      <TouchableOpacity
        style={styles.forgotPasswordLink}
        disabled={loginState.isLoading || disabled}
      >
        <Text style={styles.forgotPasswordText}>
          Mot de passe oublié ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1a1a1a',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderColor: '#fcc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#d00',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d00',
  },
  fieldErrorText: {
    color: '#d00',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
