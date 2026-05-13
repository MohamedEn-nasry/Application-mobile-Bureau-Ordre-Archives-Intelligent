import React from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons, Feather } from '@expo/vector-icons';

import { useLecteurDashboard } from '../hooks/useLecteurDashboard';
import { LecteurBottomNav } from '../../../../shared/presentation/components/LecteurBottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { Roles } from '../../../../shared/constants/roles';

export const LecteurDashboardScreen = ({ navigation, route }: any) => {
    const currentUserId = Number(route?.params?.userId ?? 0);

    const { data, isLoading, error, refetch } = useLecteurDashboard();

    const openCourrierDetail = (id: string | number) => {
        navigation.navigate(Routes.Lecteur.CourrierDetail, {
            id: Number(id),
            roleName: Roles.LECTEUR,
            userId: currentUserId,
        });
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.centerBox}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </SafeAreaView>
        );
    }

    if (error || !data) {
        return (
            <SafeAreaView style={styles.centerBox}>
                <Text style={styles.errorText}>
                    {error || 'Dashboard introuvable.'}
                </Text>

                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const firstName = data.UserFullName?.split(' ')?.[0] || 'Lecteur';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.spaceText}>Espace de consultation</Text>
                            <Text style={styles.appTitle}>Bureau d'Ordre</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.bellButton}
                            onPress={() =>
                                navigation.navigate(Routes.Lecteur.Notifications, {
                                    roleName: Roles.LECTEUR,
                                    userId: currentUserId,
                                })
                            }
                        >
                            <Ionicons name="notifications-outline" size={25} color="#fff" />

                            {data.UnreadNotifications > 0 ? (
                                <View style={styles.bellBadge}>
                                    <Text style={styles.bellBadgeText}>
                                        {data.UnreadNotifications}
                                    </Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.greeting}>Bonjour, {firstName} 👋</Text>
                    <Text style={styles.dateText}>
                        Rôle : {data.RoleName || 'Lecteur'}
                    </Text>

                    <View style={styles.searchBox}>
                        <Feather name="search" size={22} color="#d8d5ff" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher un courrier ou document..."
                            placeholderTextColor="#d8d5ff"
                        />
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <StatCard
                        icon="file-tray-full-outline"
                        value={data.IncomingCount}
                        label="Entrants"
                        color="#4f46e5"
                        bg="#eef2ff"
                    />

                    <StatCard
                        icon="send-outline"
                        value={data.OutgoingCount}
                        label="Sortants"
                        color="#10b981"
                        bg="#ecfdf5"
                    />

                    <StatCard
                        icon="archive-outline"
                        value={data.ArchivedCount}
                        label="Archives"
                        color="#f97316"
                        bg="#fff7ed"
                    />

                    <StatCard
                        icon="notifications-outline"
                        value={data.UnreadNotifications}
                        label="Alertes"
                        color="#ef4444"
                        bg="#fff1f2"
                    />
                </View>

                <SectionHeader
                    title="Documents récents"
                    action="Voir tout ›"
                    onPress={() =>
                        navigation.navigate(Routes.Lecteur.CourrierOverview, {
                            roleName: Roles.LECTEUR,
                            userId: currentUserId,
                        })
                    }
                />

                <View style={styles.cardList}>
                    {data.RecentDocuments.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.documentCard}
                            activeOpacity={0.85}
                            onPress={() => openCourrierDetail(item.id)}
                        >
                            <View style={styles.documentIcon}>
                                <Ionicons name="file-tray-full-outline" size={22} color="#4f46e5" />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.documentTitle} numberOfLines={1}>
                                    {item.Objet || item.Reference}
                                </Text>

                                <Text style={styles.documentSource} numberOfLines={1}>
                                    {item.Source || item.Reference}
                                </Text>
                            </View>

                            <View style={styles.documentRight}>
                                <StatusPill status={item.Statut} />
                                <Text style={styles.documentDate}>
                                    {formatDate(item.DateCourrier)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <SectionHeader
                    title="Dernières mises à jour"
                    action="Voir tout ›"
                    onPress={() =>
                        navigation.navigate(Routes.Lecteur.Notifications, {
                            roleName: Roles.LECTEUR,
                            userId: currentUserId,
                        })
                    }
                />

                <View style={styles.updatesCard}>
                    {data.RecentUpdates.map((item, index) => (
                        <View key={item.id} style={styles.updateItem}>
                            <View
                                style={[
                                    styles.updateDot,
                                    index > 1 && styles.updateDotMuted,
                                ]}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={styles.updateTitle}>{item.Title}</Text>
                                <Text style={styles.updateMessage} numberOfLines={1}>
                                    {item.Message}
                                </Text>
                            </View>

                            <Text style={styles.updateDate}>{item.DateLabel}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Accès rapide</Text>

                <View style={styles.quickRow}>
                    <QuickAction
                        label="Rechercher"
                        icon="search"
                        color="#4f46e5"
                        onPress={() =>
                            navigation.navigate(Routes.Lecteur.CourrierOverview, {
                                roleName: Roles.LECTEUR,
                                userId: currentUserId,
                            })
                        }
                    />

                    <QuickAction
                        label="Courriers"
                        icon="mail"
                        color="#8b22f4"
                        onPress={() =>
                            navigation.navigate(Routes.Lecteur.CourrierOverview, {
                                roleName: Roles.LECTEUR,
                                userId: currentUserId,
                            })
                        }
                    />

                    <QuickAction
                        label="Archives"
                        icon="archive"
                        color="#059669"
                        onPress={() =>
                            navigation.navigate(Routes.Lecteur.Archives, {
                                roleName: Roles.LECTEUR,
                                userId: currentUserId,
                            })
                        }
                    />
                </View>

                <View style={styles.activityCard}>
                    <View style={styles.activityIcon}>
                        <Feather name="trending-up" size={24} color="#ffffff" />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.activityTitle}>Activité cette semaine</Text>
                        <Text style={styles.activityText}>
                            {data.WeeklyCourriers} courriers enregistrés ·{' '}
                            {data.WeeklyArchives} documents archivés
                        </Text>
                    </View>
                </View>

                <View style={styles.lastUpdateRow}>
                    <Ionicons name="time-outline" size={17} color="#94a3b8" />
                    <Text style={styles.lastUpdateText}>
                        Dernière mise à jour : {data.LastUpdatedAt || 'N/A'}
                    </Text>
                </View>
            </ScrollView>

            <LecteurBottomNav
                navigation={navigation}
                active="home"
                unreadCount={data.UnreadNotifications}
                userId={currentUserId}
            />
        </SafeAreaView>
    );
};

const StatCard = ({
    icon,
    value,
    label,
    color,
    bg,
}: {
    icon: any;
    value: number;
    label: string;
    color: string;
    bg: string;
}) => {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: bg }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>

            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

const SectionHeader = ({
    title,
    action,
    onPress,
}: {
    title: string;
    action: string;
    onPress: () => void;
}) => {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>

            <TouchableOpacity onPress={onPress}>
                <Text style={styles.viewAllText}>{action}</Text>
            </TouchableOpacity>
        </View>
    );
};

const QuickAction = ({
    label,
    icon,
    color,
    onPress,
}: {
    label: string;
    icon: any;
    color: string;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            style={[styles.quickButton, { backgroundColor: color }]}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <Feather name={icon} size={30} color="#ffffff" />
            <Text style={styles.quickText}>{label}</Text>
        </TouchableOpacity>
    );
};

const StatusPill = ({ status }: { status: string }) => {
    const normalized = String(status ?? '').toLowerCase();

    let label = status || 'Statut';
    let bg = '#e2e8f0';
    let color = '#475569';

    if (normalized.includes('trait')) {
        label = 'En traitement';
        bg = '#dbeafe';
        color = '#2563eb';
    }

    if (normalized.includes('recu') || normalized.includes('reçu') || normalized.includes('traite')) {
        label = 'Reçu';
        bg = '#dcfce7';
        color = '#059669';
    }

    if (normalized.includes('urgent')) {
        label = 'Urgent';
        bg = '#fee2e2';
        color = '#ef4444';
    }

    if (normalized.includes('archive')) {
        label = 'Archivé';
        bg = '#e2e8f0';
        color = '#475569';
    }

    return (
        <View style={[styles.statusPill, { backgroundColor: bg }]}>
            <Text style={[styles.statusPillText, { color }]}>{label}</Text>
        </View>
    );
};

const formatDate = (value: string) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },

    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
    },

    errorText: {
        color: '#dc2626',
        fontWeight: '900',
        marginBottom: 12,
    },

    retryButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 14,
    },

    retryText: {
        color: '#ffffff',
        fontWeight: '900',
    },

    scrollContent: {
        paddingBottom: 28,
    },

    header: {
        backgroundColor: '#4f35eb',
        paddingHorizontal: 24,
        paddingTop: 36,
        paddingBottom: 26,
    },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    spaceText: {
        color: '#ddd6fe',
        fontSize: 14,
    },

    appTitle: {
        marginTop: 4,
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '900',
    },

    bellButton: {
        width: 48,
        height: 48,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    bellBadge: {
        position: 'absolute',
        top: -6,
        right: -4,
        minWidth: 21,
        height: 21,
        borderRadius: 999,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
    },

    bellBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '900',
    },

    greeting: {
        marginTop: 26,
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '900',
    },

    dateText: {
        marginTop: 5,
        color: '#ddd6fe',
        fontWeight: '600',
    },

    searchBox: {
        height: 52,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.18)',
        marginTop: 22,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
    },

    searchInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 12,
    },

    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 24,
        gap: 10,
    },

    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 18,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },

    statIcon: {
        width: 45,
        height: 45,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    statValue: {
        color: '#0f172a',
        fontSize: 20,
        fontWeight: '900',
    },

    statLabel: {
        marginTop: 3,
        color: '#94a3b8',
        fontWeight: '700',
        fontSize: 12,
    },

    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    sectionTitle: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: '900',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },

    viewAllText: {
        color: '#4f46e5',
        fontWeight: '900',
    },

    cardList: {
        paddingHorizontal: 20,
        gap: 12,
    },

    documentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    documentIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#eef2ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    documentTitle: {
        color: '#0f172a',
        fontWeight: '900',
        fontSize: 15,
    },

    documentSource: {
        marginTop: 5,
        color: '#94a3b8',
        fontWeight: '700',
    },

    documentRight: {
        alignItems: 'flex-end',
        marginLeft: 8,
    },

    documentDate: {
        marginTop: 7,
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
    },

    statusPill: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    statusPillText: {
        fontSize: 11,
        fontWeight: '900',
    },

    updatesCard: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        marginHorizontal: 20,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    updateItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },

    updateDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        backgroundColor: '#6366f1',
        marginRight: 14,
        marginTop: 5,
    },

    updateDotMuted: {
        backgroundColor: '#cbd5e1',
    },

    updateTitle: {
        color: '#0f172a',
        fontWeight: '900',
        fontSize: 15,
    },

    updateMessage: {
        color: '#94a3b8',
        marginTop: 5,
    },

    updateDate: {
        color: '#94a3b8',
        fontWeight: '700',
        fontSize: 12,
        marginLeft: 10,
    },

    quickRow: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
    },

    quickButton: {
        flex: 1,
        height: 98,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quickText: {
        color: '#ffffff',
        fontWeight: '900',
        marginTop: 10,
    },

    activityCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 18,
        backgroundColor: '#5b4bff',
        flexDirection: 'row',
        alignItems: 'center',
    },

    activityIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    activityTitle: {
        color: '#ffffff',
        fontWeight: '900',
    },

    activityText: {
        marginTop: 6,
        color: '#ffffff',
        fontWeight: '600',
    },

    lastUpdateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        marginTop: 22,
        marginBottom: 20,
    },

    lastUpdateText: {
        color: '#94a3b8',
        marginLeft: 8,
        fontWeight: '600',
    },
});