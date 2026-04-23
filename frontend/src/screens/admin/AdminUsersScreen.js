// src/screens/admin/AdminUsersScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SearchBar, FilterChips, Avatar, Badge, IconButton, EmptyState, Card } from '../../components';
import { Colors, Spacing, Radius, Shadow } from '../../theme';
import { USERS } from '../../data/mockData';

export default function AdminUsersScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tous');

  const filtered = USERS.filter((u) => {
    const matchSearch = !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'Tous' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = { Admin: USERS.filter(u => u.role === 'Admin').length, Agent: USERS.filter(u => u.role === 'Agent').length, Lecteur: USERS.filter(u => u.role === 'Lecteur').length };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Gestion des utilisateurs"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AdminCreateUser')}>
            <Text style={styles.addBtnText}>＋ Ajouter</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SearchBar placeholder="Rechercher un utilisateur…" value={search} onChangeText={setSearch} />

        {/* Role summary pills */}
        <View style={styles.roleSummary}>
          {[['Tous', USERS.length, Colors.gray600], ['Admin', counts.Admin, Colors.purple600], ['Agent', counts.Agent, Colors.blue600], ['Lecteur', counts.Lecteur, Colors.teal600]].map(([label, count, color]) => (
            <TouchableOpacity
              key={label}
              style={[styles.rolePill, roleFilter === label && { borderColor: color, backgroundColor: color + '14' }]}
              onPress={() => setRoleFilter(label)}
            >
              <Text style={[styles.rolePillCount, { color }]}>{count}</Text>
              <Text style={[styles.rolePillLabel, roleFilter === label && { color }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User list */}
        <Card noPad>
          {filtered.length === 0 ? (
            <EmptyState icon="👤" title="Aucun utilisateur trouvé" />
          ) : (
            filtered.map((user, idx) => (
              <TouchableOpacity
                key={user.id}
                style={[styles.userItem, idx === filtered.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => navigation.navigate('AdminEditUser', { user })}
                activeOpacity={0.82}
              >
                <Avatar initials={user.initials} role={user.role} size={44} />
                <View style={{ flex: 1 }}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user.fullName}</Text>
                    {user.status === 'Disabled' && <View style={styles.disabledTag}><Text style={styles.disabledTagText}>Désactivé</Text></View>}
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userLastLogin}>Dernière connexion : {user.lastLogin}</Text>
                </View>
                <View style={styles.userRight}>
                  <Badge label={user.role} size="sm" />
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>

        {/* Role shortcut */}
        <TouchableOpacity style={styles.rolesBtn} onPress={() => navigation.navigate('AdminRoles')}>
          <Text style={styles.rolesBtnIcon}>🔐</Text>
          <Text style={styles.rolesBtnText}>Voir les rôles et permissions</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AdminCreateUser')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  addBtn: { backgroundColor: Colors.blue800, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  addBtnText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  roleSummary: { flexDirection: 'row', gap: Spacing.sm },
  rolePill: { flex: 1, alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, paddingVertical: 10, borderWidth: 1, borderColor: Colors.gray150 },
  rolePillCount: { fontSize: 18, fontWeight: '800' },
  rolePillLabel: { fontSize: 10, fontWeight: '700', color: Colors.gray500, marginTop: 1 },
  userItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  userName: { fontSize: 14, fontWeight: '700', color: Colors.gray900 },
  userEmail: { fontSize: 12, color: Colors.gray400 },
  userLastLogin: { fontSize: 10, color: Colors.gray300, marginTop: 2 },
  userRight: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  disabledTag: { backgroundColor: Colors.red50, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  disabledTagText: { fontSize: 9, fontWeight: '700', color: Colors.red600 },
  chevron: { fontSize: 20, color: Colors.gray300 },
  rolesBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, gap: 10, borderWidth: 0.5, borderColor: Colors.border },
  rolesBtnIcon: { fontSize: 18 },
  rolesBtnText: { fontSize: 14, fontWeight: '600', color: Colors.gray700, flex: 1 },
  fab: { position: 'absolute', bottom: 24, right: Spacing.lg, width: 54, height: 54, borderRadius: 16, backgroundColor: Colors.blue800, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
  fabText: { fontSize: 26, color: '#fff', lineHeight: 32 },
});
