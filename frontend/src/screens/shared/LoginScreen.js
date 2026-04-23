// src/screens/shared/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PrimaryButton } from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!identifier.trim()) e.identifier = 'Ce champ est requis';
    if (!password.trim()) e.password = 'Ce champ est requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(identifier.trim().toLowerCase(), password);
      setLoading(false);
      if (!result.success) {
        Alert.alert('Connexion échouée', result.error);
      }
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Top stripe */}
          <View style={styles.topStripe} />

          {/* Logo area */}
          <View style={styles.logoArea}>
            <View style={styles.logoWrap}>
              <View style={styles.logo}>
                <Text style={styles.logoChar}>BO</Text>
              </View>
              <View style={styles.logoDot} />
            </View>
            <Text style={styles.appName}>Intelligent Bureau d'Ordre</Text>
            <View style={styles.appNameUnderline} />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bienvenue</Text>
            <Text style={styles.cardSub}>Connectez-vous pour accéder à votre espace de travail</Text>

            <Input
              label="Identifiant ou adresse e-mail"
              placeholder="ex: admin@bureau.dz"
              value={identifier}
              onChangeText={(v) => { setIdentifier(v); setErrors((e) => ({ ...e, identifier: null })); }}
              keyboardType="email-address"
              error={errors.identifier}
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: null })); }}
              secureTextEntry={!showPass}
              error={errors.password}
              right={
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Text style={{ fontSize: 13, color: Colors.blue600, fontWeight: '600' }}>
                    {showPass ? 'Masquer' : 'Afficher'}
                  </Text>
                </TouchableOpacity>
              }
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.checkRow} onPress={() => setRemember(!remember)}>
                <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                  {remember && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Se souvenir de moi</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotLink}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton title="Se connecter" onPress={handleLogin} loading={loading} />
          </View>

          {/* Demo credentials */}
          <View style={styles.demoBox}>
            <View style={styles.demoHeader}>
              <View style={styles.demoDot} />
              <Text style={styles.demoTitle}>Identifiants de démonstration</Text>
            </View>
            {[
              { role: 'Admin',   email: 'a.mehdi@bureau.dz',    pass: 'Admin123!',   color: Colors.purple600 },
              { role: 'Agent',   email: 's.benali@bureau.dz',   pass: 'Agent123!',   color: Colors.blue600   },
              { role: 'Lecteur', email: 'l.hamdi@bureau.dz',    pass: 'Lecteur123!', color: Colors.teal600   },
            ].map((d) => (
              <TouchableOpacity
                key={d.role}
                style={styles.demoRow}
                onPress={() => { setIdentifier(d.email); setPassword(d.pass); }}
              >
                <View style={[styles.demoRolePill, { backgroundColor: d.color + '18', borderColor: d.color + '40' }]}>
                  <Text style={[styles.demoRoleText, { color: d.color }]}>{d.role}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.demoEmail}>{d.email}</Text>
                  <Text style={styles.demoPass}>{d.pass}</Text>
                </View>
                <Text style={{ fontSize: 11, color: Colors.blue600, fontWeight: '600' }}>Utiliser</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            L'accès aux comptes est géré par l'administrateur système
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingBottom: Spacing.xxl },
  topStripe: { height: 4, backgroundColor: Colors.blue800 },
  logoArea: { alignItems: 'center', paddingTop: 36, paddingBottom: 28 },
  logoWrap: { position: 'relative', marginBottom: 14 },
  logo: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.blue800, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  logoChar: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  logoDot: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.teal400, borderWidth: 2.5, borderColor: Colors.background },
  appName: { fontSize: 15, fontWeight: '800', color: Colors.blue900, letterSpacing: 0.3 },
  appNameUnderline: { width: 32, height: 2.5, backgroundColor: Colors.blue400, borderRadius: 2, marginTop: 6 },
  card: { marginHorizontal: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 0.5, borderColor: Colors.border, ...Shadow.md },
  cardTitle: { fontSize: 24, fontWeight: '800', color: Colors.blue900, marginBottom: 6, letterSpacing: -0.3 },
  cardSub: { fontSize: 13, color: Colors.gray500, lineHeight: 18, marginBottom: Spacing.xl },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl, marginTop: -4 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: Colors.gray200, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.blue800, borderColor: Colors.blue800 },
  checkMark: { fontSize: 11, color: '#fff', fontWeight: '900' },
  checkLabel: { fontSize: 13, color: Colors.gray600 },
  forgotLink: { fontSize: 13, color: Colors.blue600, fontWeight: '700' },
  demoBox: { margin: Spacing.lg, marginTop: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.gray150, overflow: 'hidden' },
  demoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.gray50, paddingHorizontal: Spacing.md, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: Colors.gray150 },
  demoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green400 },
  demoTitle: { fontSize: 11, fontWeight: '800', color: Colors.gray600, textTransform: 'uppercase', letterSpacing: 0.5 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  demoRolePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, minWidth: 64, alignItems: 'center' },
  demoRoleText: { fontSize: 11, fontWeight: '800' },
  demoEmail: { fontSize: 12, color: Colors.gray700, fontWeight: '500' },
  demoPass: { fontSize: 11, color: Colors.gray400, fontFamily: 'monospace' },
  footer: { textAlign: 'center', fontSize: 11, color: Colors.gray300, paddingHorizontal: Spacing.xl, lineHeight: 17, marginTop: 8 },
});
