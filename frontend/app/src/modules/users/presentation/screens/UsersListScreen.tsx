import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useUsersList } from '../hooks/useUsersList';
import { Routes } from '../../../../shared/constants/routes';
import { BottomNav } from '../../../../shared/presentation/components/BottomNav';
import { useDeactivateUser } from '../hooks/useDeactivateUser';
import { useActivateUser } from '../hooks/useActivateUser';

type FilterType = 'all' | 'active' | 'inactive';

export const UsersListScreen = ({ navigation }: any) => {
  const { users, isLoading, error, refetch } = useUsersList();
  const { deactivateUser } = useDeactivateUser();
  const { activateUser } = useActivateUser();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [menuUserId, setMenuUserId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter((u: any) => u.IsActive).length ?? 0;
  const inactiveUsers = totalUsers - activeUsers;

  const filteredUsers = useMemo(() => {
    return (users ?? []).filter((user: any) => {
      const fullName = `${user.FirstName ?? ''} ${user.LastName ?? ''}`.toLowerCase();
      const email = `${user.Email ?? ''}`.toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch = fullName.includes(query) || email.includes(query);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && user.IsActive) ||
        (filter === 'inactive' && !user.IsActive);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const selectedUser = useMemo(() => {
    return filteredUsers.find((u: any) => u.id === menuUserId);
  }, [filteredUsers, menuUserId]);

  const renderUser = ({ item }: any) => {
    const firstName = item.FirstName ?? '';
    const lastName = item.LastName ?? '';
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    const role = item.RoleName ?? 'Agent';

    return (
      <View style={styles.userCard}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, !item.IsActive && styles.avatarInactive]}>
            <Text style={styles.avatarText}>{initials || 'U'}</Text>
          </View>

          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.IsActive ? '#22C55E' : '#FB7185' },
            ]}
          />
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {firstName} {lastName}
            </Text>

            {!item.IsActive && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Désactivé</Text>
              </View>
            )}
          </View>

          <Text style={styles.userEmail} numberOfLines={1}>
            {item.Email}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={(event) => {
            const { pageX, pageY } = event.nativeEvent;

            setMenuPosition({
              x: pageX - 230,
              y: pageY + 10,
            });

            setMenuUserId(item.id);
          }}
        >
          <Feather name="more-vertical" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && !users) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="menu" size={25} color="#334155" />
          </TouchableOpacity>

          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Utilisateurs</Text>
            <Text style={styles.headerSubTitle}>Gestion des comptes</Text>
          </View>

          <TouchableOpacity style={styles.bellButton}>
            <Feather name="bell" size={22} color="#334155" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={renderUser}
        refreshing={isLoading}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.topPanel}>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.statValue, { color: '#2563EB' }]}>
                  {totalUsers}
                </Text>
                <Text style={[styles.statLabel, { color: '#2563EB' }]}>
                  Total
                </Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.statValue, { color: '#009B58' }]}>
                  {activeUsers}
                </Text>
                <Text style={[styles.statLabel, { color: '#009B58' }]}>
                  Actifs
                </Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
                <Text style={[styles.statValue, { color: '#EF001B' }]}>
                  {inactiveUsers}
                </Text>
                <Text style={[styles.statLabel, { color: '#EF001B' }]}>
                  Désactivés
                </Text>
              </View>
            </View>

            <View style={styles.searchBox}>
              <Feather name="search" size={18} color="#94A3B8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Rechercher un utilisateur..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.filtersRow}>
              <FilterPill
                label="Tous"
                active={filter === 'all'}
                onPress={() => setFilter('all')}
              />
              <FilterPill
                label="Actifs"
                active={filter === 'active'}
                onPress={() => setFilter('active')}
              />
              <FilterPill
                label="Désactivés"
                active={filter === 'inactive'}
                onPress={() => setFilter('inactive')}
              />
            </View>
          </View>
        }
      />

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.fab}
        onPress={() => navigation.navigate(Routes.Admin.CreateUpdateUser)}
      >
        <Ionicons name="person-add-outline" size={27} color="#FFFFFF" />
      </TouchableOpacity>

      <BottomNav navigation={navigation} activeRoute="Utilisateurs" />

      <Modal
        transparent
        visible={menuUserId !== null}
        animationType="fade"
        onRequestClose={() => setMenuUserId(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuUserId(null)}
        >
          <View
            style={[
              styles.actionMenu,
              {
                left: menuPosition.x,
                top: menuPosition.y,
              },
            ]}
          >
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="eye" size={16} color="#334155" />
              <Text style={styles.menuText}>Voir profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}
              onPress={() => {
                // Serialize user data to avoid "Non-serializable values" warning
                const serializableUser = selectedUser ? {
                  ...selectedUser,
                  CreatedAt: selectedUser.CreatedAt?.toISOString(),
                  UpdatedAt: selectedUser.UpdatedAt?.toISOString(),
                } : null;
                
                navigation.navigate(Routes.Admin.CreateUpdateUser, { user: serializableUser });
                setMenuUserId(null);
              }}>
              <Feather name="edit-2" size={16} color="#2563EB" />
              <Text style={[styles.menuText, { color: '#2563EB' }]}>
                Modifier
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                if (menuUserId === null) return;

                let result;
                if (selectedUser?.IsActive) {
                  result = await deactivateUser(menuUserId);
                } else {
                  result = await activateUser(menuUserId);
                }

                setMenuUserId(null);

                if (result) {
                  refetch();
                }
              }}
            >
              <Feather
                name={selectedUser?.IsActive ? "user-x" : "user-check"}
                size={16}
                color={selectedUser?.IsActive ? "#F97316" : "#22C55E"}
              />
              <Text style={[styles.menuText, { color: selectedUser?.IsActive ? '#F97316' : '#22C55E' }]}>
                {selectedUser?.IsActive ? 'Désactiver' : 'Activer'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.lastMenuItem]}
              onPress={() => {
                if (!selectedUser?.id) return;
                navigation.navigate(Routes.Admin.ChangePassword, { userId: Number(selectedUser.id) });
                setMenuUserId(null);
              }}
            >
              <Feather name="key" size={16} color="#EF4444" />
              <Text style={[styles.menuText, { color: '#EF4444' }]}>
                Réinit. mot de passe
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const FilterPill = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.filterPill, active && styles.filterPillActive]}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    height: 74,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleBlock: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubTitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 1,
  },
  bellButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF304D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  topPanel: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingBottom: 12,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    height: 74,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  searchBox: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 15,
    color: '#0F172A',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(15, 23, 42, 0.08)',
    elevation: 3,
  },
  avatarWrap: {
    marginRight: 14,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInactive: {
    backgroundColor: '#94A3B8',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 19,
  },
  statusDot: {
    position: 'absolute',
    right: 1,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    flexShrink: 1,
  },
  userEmail: {
    fontSize: 14,
    color: '#8AA0C0',
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
  },
  inactiveBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  inactiveBadgeText: {
    color: '#EF001B',
    fontSize: 13,
    fontWeight: '800',
  },
  moreBtn: {
    width: 28,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 86,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 12px rgba(37, 99, 235, 0.28)',
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  actionMenu: {
    position: 'absolute',
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 6,
    boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.18)',
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
});