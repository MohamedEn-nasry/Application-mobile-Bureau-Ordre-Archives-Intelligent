import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Modal,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { LecteurCourrierCard } from '../components/LecteurCourrierCard';
import { LecteurBottomNav } from '../../../../shared/presentation/components/LecteurBottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { Roles } from '../../../../shared/constants/roles';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';

import { useLecteurCourriers } from '../hooks/useLecteurCourriers';
import { useCategories } from '../hooks/useCategories';

type TabType = 'Entrants' | 'Sortants' | 'Archive';

// Status options matching the backend CourrierStatus values
const STATUS_OPTIONS = [
    { value: null, label: 'Tous' },
    { value: 'ATraiter', label: 'En attente' },
    { value: 'EnTraitement', label: 'En traitement' },
    { value: 'Traite', label: 'Traité' },
    { value: 'Recu', label: 'Reçu' },
    { value: 'Archive', label: 'Archivé' },
];

export const LecteurCourriersScreen = ({ navigation, route }: any) => {
    const styles = useThemeStyles(localStyles);
    const { items, isLoading, error, refetch } = useLecteurCourriers();
    const { categories, isLoading: isLoadingCategories } = useCategories();

    const [activeTab, setActiveTab] = useState<TabType>('Entrants');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Filter state
    const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedStatut, setSelectedStatut] = useState<string | null>(null);
    const [selectedCategorieId, setSelectedCategorieId] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'expediteur' | 'objet' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Modal visibility
    const [showStatutModal, setShowStatutModal] = useState(false);
    const [showCategorieModal, setShowCategorieModal] = useState(false);

    const currentUserId = Number(route?.params?.userId ?? 0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Refetch from API when tab or search changes
    useEffect(() => {
        let typeFilter: string | undefined;
        if (activeTab === 'Entrants') typeFilter = 'Entrant';
        else if (activeTab === 'Sortants') typeFilter = 'Sortant';
        // Archive is handled client-side by statut filter

        refetch({
            type: typeFilter,
            categorieId: selectedCategorieId ?? undefined,
            search: debouncedSearch || undefined,
        });
    }, [activeTab, debouncedSearch, selectedCategorieId, refetch]);

    // Client-side sort + filter
    const displayedItems = useMemo(() => {
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

        // Archive tab: show only items with Statut=Archive (overrides any manual statut filter)
        if (activeTab === 'Archive') {
            result = result.filter(item =>
                item.statut.toLowerCase() === 'archive'
            );
        } else if (selectedStatut) {
            // Manual statut filter pill (only active on Entrants/Sortants tabs)
            result = result.filter(item =>
                item.statut.toLowerCase() === selectedStatut.toLowerCase()
            );
        }

        // Filter by date (from)
        if (selectedDateFrom) {
            result = result.filter(item =>
                new Date(item.dateCourrier) >= selectedDateFrom
            );
        }

        // Client-side sort
        if (sortBy) {
            result.sort((a, b) => {
                const valA = sortBy === 'expediteur' ? a.expediteur : a.objet;
                const valB = sortBy === 'expediteur' ? b.expediteur : b.objet;
                const cmp = valA.localeCompare(valB);
                return sortDirection === 'asc' ? cmp : -cmp;
            });
        } else {
            // Default: sort by date desc
            result.sort((a, b) =>
                new Date(b.dateCourrier).getTime() - new Date(a.dateCourrier).getTime()
            );
        }

        return result;
    }, [items, selectedStatut, selectedDateFrom, sortBy, sortDirection]);

    // ─── Helpers ───────────────────────────────────────────────────────────────

    const handleSortToggle = (field: 'expediteur' | 'objet') => {
        if (sortBy === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };

    const clearAllFilters = () => {
        setSelectedDateFrom(null);
        setSelectedStatut(null);
        setSelectedCategorieId(null);
        setSortBy(null);
        setSortDirection('asc');
        setSearchQuery('');
    };

    const selectedStatutLabel = STATUS_OPTIONS.find(s => s.value === selectedStatut)?.label ?? 'Statut';
    const selectedCategorieName = categories.find(c => Number(c.id) === selectedCategorieId)?.Nom ?? 'Catégorie';

    const formatDate = (date: Date) =>
        date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

    const hasActiveFilters = selectedDateFrom || selectedStatut || selectedCategorieId || sortBy;

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>

            {/* ── Header ────────────────────────────────────────────────────────── */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Courrier</Text>
                    <TouchableOpacity style={styles.searchIconBtn}>
                        <Feather name="search" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Search bar */}
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color="#9CA3AF" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Rechercher un courrier..."
                        placeholderTextColor="#9CA3AF"
                        style={styles.searchInput}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabsRow}>
                    {(['Entrants', 'Sortants', 'Archive'] as TabType[]).map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* ── Content ───────────────────────────────────────────────────────── */}
            <View style={styles.content}>

                {/* Filter pills row */}
                <View style={styles.filtersWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersRow}
                    >
                        {/* ── Date pill ── */}
                        <TouchableOpacity
                            style={[styles.pill, !!selectedDateFrom && styles.pillActive]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Feather
                                name="calendar"
                                size={13}
                                color={selectedDateFrom ? '#4F46E5' : '#64748B'}
                                style={{ marginRight: 5 }}
                            />
                            <Text style={[styles.pillText, !!selectedDateFrom && styles.pillTextActive]}>
                                {selectedDateFrom ? `Depuis ${formatDate(selectedDateFrom)}` : 'Date'}
                            </Text>
                            <Feather name="chevron-down" size={13} color={selectedDateFrom ? '#4F46E5' : '#64748B'} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>

                        {/* ── Expéditeur pill (sort) ── */}
                        <TouchableOpacity
                            style={[styles.pill, sortBy === 'expediteur' && styles.pillActive]}
                            onPress={() => handleSortToggle('expediteur')}
                        >
                            <Text style={[styles.pillText, sortBy === 'expediteur' && styles.pillTextActive]}>
                                Expéditeur {sortBy === 'expediteur' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </Text>
                        </TouchableOpacity>

                        {/* ── Objet pill (sort) ── */}
                        <TouchableOpacity
                            style={[styles.pill, sortBy === 'objet' && styles.pillActive]}
                            onPress={() => handleSortToggle('objet')}
                        >
                            <Text style={[styles.pillText, sortBy === 'objet' && styles.pillTextActive]}>
                                Objet {sortBy === 'objet' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </Text>
                        </TouchableOpacity>

                        {/* ── Statut pill ── */}
                        <TouchableOpacity
                            style={[styles.pill, !!selectedStatut && styles.pillActive]}
                            onPress={() => setShowStatutModal(true)}
                        >
                            <Text style={[styles.pillText, !!selectedStatut && styles.pillTextActive]}>
                                {selectedStatutLabel}
                            </Text>
                            <Feather name="chevron-down" size={13} color={selectedStatut ? '#4F46E5' : '#64748B'} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>


                        {/* ── Clear filters ── */}
                        {hasActiveFilters && (
                            <TouchableOpacity
                                style={[styles.pill, styles.pillClear]}
                                onPress={clearAllFilters}
                            >
                                <Feather name="x" size={13} color="#EF4444" style={{ marginRight: 4 }} />
                                <Text style={[styles.pillText, { color: '#EF4444' }]}>Réinitialiser</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>

                {/* Results count */}
                <Text style={styles.countText}>
                    {displayedItems.length} courrier{displayedItems.length !== 1 ? 's' : ''}
                </Text>

                {/* List */}
                {isLoading ? (
                    <View style={styles.centerBox}>
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text style={styles.infoText}>Chargement...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerBox}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryBtn}
                            onPress={() => refetch({ type: activeTab === 'Entrants' ? 'Entrant' : activeTab === 'Sortants' ? 'Sortant' : undefined })}
                        >
                            <Text style={styles.retryBtnText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                ) : displayedItems.length === 0 ? (
                    <View style={styles.centerBox}>
                        <Feather name="inbox" size={48} color="#CBD5E1" />
                        <Text style={[styles.infoText, { marginTop: 16 }]}>Aucun courrier trouvé.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayedItems}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <LecteurCourrierCard
                                item={item}
                                onPress={() =>
                                    navigation.navigate(Routes.Lecteur.CourrierDetail, {
                                        id: item.id,
                                        courrierId: item.id,
                                        roleName: Roles.LECTEUR,
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

            {/* ── Bottom nav ────────────────────────────────────────────────────── */}
            <LecteurBottomNav
                navigation={navigation}
                active="courrier"
                unreadCount={route?.params?.unreadCount ?? 0}
                userId={currentUserId}
            />

            {/* ═══════════════════════════════════════════════════════════════════
                DATE PICKER
            ═══════════════════════════════════════════════════════════════════ */}
            {showDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={selectedDateFrom ?? new Date()}
                    mode="date"
                    display="default"
                    onChange={(_event, date) => {
                        setShowDatePicker(false);
                        if (date) setSelectedDateFrom(date);
                    }}
                />
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                STATUT MODAL — même pattern que CourrierForm catégorie
            ═══════════════════════════════════════════════════════════════════ */}
            <Modal
                visible={showStatutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowStatutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Filtrer par statut</Text>

                        <ScrollView style={styles.modalList}>
                            {STATUS_OPTIONS.map(option => {
                                const isSelected = selectedStatut === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value ?? '__all__'}
                                        style={[styles.modalOption, isSelected && styles.modalOptionActive]}
                                        onPress={() => {
                                            setSelectedStatut(option.value);
                                            setShowStatutModal(false);
                                        }}
                                    >
                                        <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}>
                                            {option.label}
                                        </Text>
                                        {isSelected && <Text style={styles.checkMark}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setShowStatutModal(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ═══════════════════════════════════════════════════════════════════
                CATÉGORIE MODAL — identique à CourrierForm
            ═══════════════════════════════════════════════════════════════════ */}
            <Modal
                visible={showCategorieModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCategorieModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Choisir une catégorie</Text>

                        <ScrollView style={styles.modalList}>
                            {/* "All" option */}
                            <TouchableOpacity
                                style={[styles.modalOption, !selectedCategorieId && styles.modalOptionActive]}
                                onPress={() => {
                                    setSelectedCategorieId(null);
                                    setShowCategorieModal(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, !selectedCategorieId && styles.modalOptionTextActive]}>
                                    Toutes les catégories
                                </Text>
                                {!selectedCategorieId && <Text style={styles.checkMark}>✓</Text>}
                            </TouchableOpacity>

                            {isLoadingCategories ? (
                                <ActivityIndicator size="small" color="#4F46E5" style={{ marginVertical: 20 }} />
                            ) : categories.length > 0 ? (
                                categories.map(cat => {
                                    const isSelected = Number(cat.id) === selectedCategorieId;
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[styles.modalOption, isSelected && styles.modalOptionActive]}
                                            onPress={() => {
                                                setSelectedCategorieId(Number(cat.id));
                                                setShowCategorieModal(false);
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextActive]}>
                                                    {cat.Nom}
                                                </Text>
                                                {cat.Description ? (
                                                    <Text style={styles.modalOptionSub}>{cat.Description}</Text>
                                                ) : null}
                                            </View>
                                            {isSelected && <Text style={styles.checkMark}>✓</Text>}
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text style={styles.emptyText}>Aucune catégorie disponible.</Text>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setShowCategorieModal(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3B36D3',
    },

    // ── Header ─────────────────────────────────────────────────────────────────
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#3B36D3',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    searchIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 50,
        marginBottom: 22,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        marginLeft: 10,
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    tabActive: {
        borderBottomWidth: 3,
        borderBottomColor: '#FFFFFF',
    },
    tabText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 16,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FFFFFF',
        fontWeight: '800',
    },

    // ── Content ────────────────────────────────────────────────────────────────
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
    },
    filtersWrapper: {
        marginBottom: 12,
    },
    filtersRow: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 8,
    },
    pillActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#4F46E5',
    },
    pillClear: {
        borderColor: '#FEE2E2',
        backgroundColor: '#FFF5F5',
    },
    pillText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '600',
    },
    pillTextActive: {
        color: '#4F46E5',
        fontWeight: '700',
    },
    countText: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 20,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    infoText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '500',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    retryBtn: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    retryBtnText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },

    // ── Modals — même style que CourrierForm ───────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        justifyContent: 'center',
        paddingHorizontal: 22,
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        maxHeight: '75%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 14,
    },
    modalList: {
        maxHeight: 380,
    },
    modalOption: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOptionActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    modalOptionText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalOptionTextActive: {
        color: '#2563EB',
    },
    modalOptionSub: {
        marginTop: 4,
        color: '#64748B',
        fontSize: 13,
    },
    checkMark: {
        color: '#2563EB',
        fontSize: 18,
        fontWeight: '900',
    },
    emptyText: {
        color: '#94A3B8',
        textAlign: 'center',
        paddingVertical: 20,
        fontWeight: '700',
    },
    modalCloseBtn: {
        marginTop: 8,
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalCloseBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 15,
    },
});
