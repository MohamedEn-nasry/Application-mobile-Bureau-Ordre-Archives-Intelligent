import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { OutgoingMailCard } from '../components/OutgoingMailCard';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { Roles } from '../../../../shared/constants/roles';

import { useAgentOutgoingMail } from '../hooks/useAgentOutgoingMail';

type StatusFilter = 'ALL' | 'DRAFT' | 'VALIDATED' | 'SENT' | 'ARCHIVED';

export const AgentOutgoingMailScreen = ({ navigation, route }: any) => {
    const { items, isLoading, error, refetch } = useAgentOutgoingMail();

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [sortBy, setSortBy] = useState<'receiver' | 'subject' | 'date'>('date');

    const currentUserId = Number(route?.params?.userId ?? 0);

    const mapStatusToFilter = (status: string): StatusFilter => {
        const s = status?.toLowerCase()?.trim();

        if (s === 'brouillon' || s === 'draft') return 'DRAFT';
        if (s === 'valide' || s === 'validé' || s === 'validated') return 'VALIDATED';
        if (s === 'envoye' || s === 'envoyé' || s === 'sent') return 'SENT';
        if (s === 'archive' || s === 'archivé' || s === 'archived') return 'ARCHIVED';

        return 'ALL';
    };

    const handleSortPress = (value: 'receiver' | 'subject' | 'date') => {
        if (sortBy === value) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(value);
            setSortDirection('asc');
        }
    };

    const outgoingItems = useMemo(() => {
        let result = items.map(item => ({
            id: Number(item.id),
            reference: item.Reference,
            objet: item.Objet,
            destinataire: item.Destinataire ?? 'Destinataire non défini',
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
                item.destinataire.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(item => mapStatusToFilter(item.statut) === statusFilter);
        }

        result.sort((a, b) => {
            let compareValue = 0;

            if (sortBy === 'receiver') {
                compareValue = a.destinataire.localeCompare(b.destinataire);
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
        setStatusFilter(prev => {
            if (prev === 'ALL') return 'DRAFT';
            if (prev === 'DRAFT') return 'VALIDATED';
            if (prev === 'VALIDATED') return 'SENT';
            if (prev === 'SENT') return 'ARCHIVED';
            return 'ALL';
        });
    };

    const getStatusFilterLabel = () => {
        if (statusFilter === 'DRAFT') return 'Draft';
        if (statusFilter === 'VALIDATED') return 'Validated';
        if (statusFilter === 'SENT') return 'Sent';
        if (statusFilter === 'ARCHIVED') return 'Archived';
        return 'Status';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Outgoing Mail</Text>

                <View style={styles.searchBox}>
                    <Feather name="search" size={18} color="#D1D5DB" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by reference, receiver..."
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
                            sortBy === 'receiver' && styles.filterChipActive,
                        ]}
                        onPress={() => handleSortPress('receiver')}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                sortBy === 'receiver' && styles.filterChipActiveText,
                            ]}
                        >
                            Receiver {sortBy === 'receiver' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </Text>
                        <Feather
                            name="chevron-down"
                            size={15}
                            color={sortBy === 'receiver' ? '#FFFFFF' : '#64748B'}
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

                <Text style={styles.countText}>{outgoingItems.length} mail items</Text>

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
                        data={outgoingItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <OutgoingMailCard
                                item={item}
                                onPress={() =>
                                    navigation.navigate(Routes.Agent.CourrierDetail, {
                                        id: item.id,
                                        courrierId: item.id,
                                        roleName: Roles.AGENT,
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
                        roleName: Roles.AGENT,
                        userId: currentUserId,
                        initialType: 'Sortant',
                    })
                }
            >
                <Feather name="plus" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <AgentBottomNav
                navigation={navigation}
                active="outgoing"
                unreadCount={route?.params?.unreadCount ?? 0}
                userId={currentUserId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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