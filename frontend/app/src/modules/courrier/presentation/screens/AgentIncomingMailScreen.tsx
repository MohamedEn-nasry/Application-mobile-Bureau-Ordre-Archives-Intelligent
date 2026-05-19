import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { IncomingMailCard } from '../components/IncomingMailCard';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { Roles } from '../../../../shared/constants/roles';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

import { useAgentIncomingMail } from '../hooks/useAgentIncomingMail';
import { useAuthSession } from '../../../auth/presentation/hooks/useAuthSession';

type StatusFilter = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export const AgentIncomingMailScreen = ({ navigation, route }: any) => {
    const styles = useThemeStyles(localStyles);
    const { items, isLoading, error, refetch } = useAgentIncomingMail();
    const { session } = useAuthSession();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [sortBy, setSortBy] = useState<'sender' | 'subject' | 'date'>('date');

    const currentUserId = Number(route?.params?.userId ?? session?.userId ?? 0);
    const currentRole = route?.params?.roleName || session?.role || Roles.AGENT;

    const mapStatusToFilter = (status: string): StatusFilter => {
        const s = status?.toLowerCase()?.trim();

        if (s === 'en attente' || s === 'atraiter' || s === 'pending') {
            return 'PENDING';
        }

        if (
            s === 'entraiter' ||
            s === 'en traitement' ||
            s === 'in progress' ||
            s === 'inprogress'
        ) {
            return 'IN_PROGRESS';
        }

        if (
            s === 'recu' ||
            s === 'reçu' ||
            s === 'traite' ||
            s === 'traité' ||
            s === 'completed'
        ) {
            return 'COMPLETED';
        }

        return 'ALL';
    };
    const handleSortPress = (value: 'sender' | 'subject' | 'date') => {
        if (sortBy === value) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(value);
            setSortDirection('asc');
        }
    };

    const incomingItems = useMemo(() => {
        let result = items.map(item => ({
            id: Number(item.id),
            reference: item.Reference,
            objet: item.Objet,
            expediteur: item.Expediteur ?? 'Expéditeur non défini',
            dateCourrier: item.DateCourrier.toISOString(),
            statut: item.Statut,
            texteOcr: item.TexteOcr,
            pieceJointeCount: item.PieceJointeCount,
        }));

        const query = search.trim().toLowerCase();

        if (query) {
            result = result.filter(item =>
                item.reference.toLowerCase().includes(query) ||
                item.objet.toLowerCase().includes(query) ||
                item.expediteur.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(item => mapStatusToFilter(item.statut) === statusFilter);
        }

        result.sort((a, b) => {
            let compareValue = 0;

            if (sortBy === 'sender') {
                compareValue = a.expediteur.localeCompare(b.expediteur);
            }

            if (sortBy === 'subject') {
                compareValue = a.objet.localeCompare(b.objet);
            }

            if (sortBy === 'date') {
                compareValue =
                    new Date(a.dateCourrier).getTime() -
                    new Date(b.dateCourrier).getTime();
            }

            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        return result;
    }, [items, search, statusFilter, sortBy, sortDirection]);



    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === 'ALL') return 'PENDING';
            if (prev === 'PENDING') return 'IN_PROGRESS';
            if (prev === 'IN_PROGRESS') return 'COMPLETED';
            return 'ALL';
        });
    };

    const getStatusFilterLabel = () => {
        if (statusFilter === 'PENDING') return 'Pending';
        if (statusFilter === 'IN_PROGRESS') return 'In Progress';
        if (statusFilter === 'COMPLETED') return 'Completed';
        return 'Status';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Incoming Mail</Text>

                <View style={styles.searchBox}>
                    <Feather name="search" size={18} color="#D1D5DB" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by reference, sender..."
                        placeholderTextColor="#D1D5DB"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.filtersRow}>
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            sortBy === 'sender' && styles.filterChipActive,
                        ]}
                        onPress={() => handleSortPress('sender')}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                sortBy === 'sender' && styles.filterChipActiveText,
                            ]}
                        >
                            Sender {sortBy === 'sender' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </Text>
                        <Feather
                            name="chevron-down"
                            size={15}
                            color={sortBy === 'sender' ? '#FFFFFF' : '#64748B'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            sortBy === 'subject' && styles.filterChipActive,
                        ]}
                        onPress={() => handleSortPress('subject')}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                sortBy === 'subject' && styles.filterChipActiveText,
                            ]}
                        >
                            Subject {sortBy === 'subject' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </Text>
                        <Feather
                            name="chevron-down"
                            size={15}
                            color={sortBy === 'subject' ? '#FFFFFF' : '#64748B'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            statusFilter !== 'ALL' && styles.filterChipActive,
                        ]}
                        onPress={cycleStatusFilter}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                statusFilter !== 'ALL' && styles.filterChipActiveText,
                            ]}
                        >
                            {getStatusFilterLabel()}
                        </Text>
                        <Feather
                            name="chevron-down"
                            size={15}
                            color={statusFilter !== 'ALL' ? '#FFFFFF' : '#64748B'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterChip}
                        onPress={() => {
                            setSearch('');
                            setStatusFilter('ALL');
                            setSortBy('date');
                            setSortDirection('desc');
                        }}
                    >
                        <Feather name="filter" size={15} color="#64748B" />
                        <Text style={styles.filterChipText}>Filters</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.countText}>{incomingItems.length} mail items</Text>

                {isLoading ? (
                    <View style={styles.centerBox}>
                        <Text style={styles.infoText}>Chargement...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerBox}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                            <Text style={styles.retryButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={incomingItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <IncomingMailCard
                                item={item}
                                onPress={() =>
                                    navigation.navigate(Routes.Agent.CourrierDetail, {
                                        id: item.id,
                                        courrierId: item.id,
                                        roleName: currentRole,
                                        userId: currentUserId,
                                    })
                                }
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.9}
                onPress={() =>
                    navigation.navigate(Routes.Agent.CreateUpdateCourrier, {
                        roleName: currentRole,
                        userId: currentUserId,
                        initialType: 'Entrant',
                    })
                }
            >
                <Feather name="plus" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <AgentBottomNav
                navigation={navigation}
                active="incoming"
                unreadCount={route?.params?.unreadCount ?? 0}
                userId={currentUserId}
                roleName={currentRole}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#312E81',
    },

    header: {
        backgroundColor: '#4F46E5',
        paddingTop: 52,
        paddingHorizontal: 20,
        paddingBottom: 22,
    },

    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 18,
    },

    searchBox: {
        height: 50,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.14)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },

    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        marginLeft: 10,
        fontSize: 15,
    },

    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -2,
        paddingTop: 14,
        paddingHorizontal: 16,
    },

    filtersRow: {
        flexDirection: 'row',
        marginBottom: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
        paddingHorizontal: 14,
        height: 38,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    filterChipActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },

    filterChipText: {
        color: '#475569',
        fontWeight: '600',
        fontSize: 14,
        marginRight: 5,
    },

    filterChipActiveText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
        marginRight: 5,
    },

    countText: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
    },

    listContent: {
        paddingBottom: 120,
    },

    centerBox: {
        paddingTop: 40,
        alignItems: 'center',
    },

    infoText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '600',
    },

    errorText: {
        color: '#DC2626',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },

    retryButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },

    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },

    fab: {
        position: 'absolute',
        right: 22,
        bottom: 92,
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#312E81',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
        elevation: 8,
    },
});