import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface LoginFormProps {
  onSubmit: (username: string, password?: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const [email, setemail] = useState("Ahmed@gmail.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerWrapper}>
              <LinearGradient
                colors={["#4338CA", "#4F46E5", "#3730A3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
              >
                <View style={styles.circleTop} />
                <View style={styles.circleBottom} />

                <View style={styles.headerContent}>
                  <View style={styles.logoOuter}>
                    <View style={styles.logoInner}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={28}
                        color="#4F46E5"
                      />
                    </View>
                  </View>

                  <Text style={styles.headerSmallText}>Intelligent</Text>
                  <Text style={styles.headerTitle}>Bureau d'Ordre</Text>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Admin Portal</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <View style={styles.welcomeBlock}>
                <Text style={styles.welcomeTitle}>Bienvenue</Text>
                <Text style={styles.welcomeSubtitle}>
                  Identifiez-vous pour gérer le courrier
                </Text>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* email */}
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Identifiant</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="votre.nom"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setemail}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Mot de passe</Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#9CA3AF"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />

                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Options */}
              <View style={styles.optionsRow}>
                <Pressable
                  onPress={() => setRemember(!remember)}
                  style={styles.rememberRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      remember
                        ? styles.checkboxActive
                        : styles.checkboxInactive,
                    ]}
                  >
                    {remember ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : null}
                  </View>

                  <Text style={styles.rememberText}>Se souvenir</Text>
                </Pressable>

                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Oublié ?</Text>
                </TouchableOpacity>
              </View>

              {/* Button */}
              <TouchableOpacity
                disabled={isLoading}
                onPress={() => onSubmit(email, password)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#4F46E5", "#4338CA"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.loginButton}
                >
                  {isLoading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.loginButtonText}>
                        Connexion en cours...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Security Box */}
              <View style={styles.securityBox}>
                <View style={styles.securityIconBox}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color="#6366F1"
                  />
                </View>

                <Text style={styles.securityText}>
                  Accès sécurisé réservé au personnel. Les tentatives d'accès
                  non autorisées sont enregistrées.
                </Text>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  INTELLECTUAL BUREAU D'ORDRE v2.4.1
                </Text>
                <Text style={styles.footerText}>© 2026 DIRECTION GÉNÉRALE</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  headerWrapper: {
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 72,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    position: "relative",
    overflow: "hidden",
  },
  circleTop: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  circleBottom: {
    position: "absolute",
    bottom: -50,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 999,
    backgroundColor: "rgba(165,180,252,0.12)",
  },
  headerContent: {
    alignItems: "center",
  },
  logoOuter: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logoInner: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerSmallText: {
    marginBottom: 4,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2.5,
    color: "#C7D2FE",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
    color: "#FFFFFF",
    textAlign: "center",
  },
  badge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: "#FFFFFF",
  },

  card: {
    flex: 1,
    marginTop: -28,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
  },
  welcomeBlock: {
    marginBottom: 24,
  },
  welcomeTitle: {
    marginBottom: 4,
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  errorBox: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    textAlign: "center",
    fontWeight: "500",
    color: "#DC2626",
    fontSize: 13,
  },

  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#9CA3AF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 15,
    minHeight: 54,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1F2937",
    paddingVertical: 0,
  },

  optionsRow: {
    marginTop: 4,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    borderColor: "#4F46E5",
    backgroundColor: "#4F46E5",
  },
  checkboxInactive: {
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "500",
    color: "#4B5563",
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },

  loginButton: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  securityBox: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    backgroundColor: "rgba(238,242,255,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  securityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  securityText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "500",
    color: "#4338CA",
  },

  footer: {
    marginTop: 26,
    paddingBottom: 8,
  },
  footerText: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
  },
});
