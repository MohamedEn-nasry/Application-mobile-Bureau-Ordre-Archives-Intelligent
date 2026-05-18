import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { useUserProfile } from '../hooks/useUserProfile';
// import { useLogout } from '../hooks/useLogout';
import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { useAuth } from "../../../../application/providers/AuthProvider";
import { Roles } from '../../../../shared/constants/roles';
import { LecteurBottomNav } from '../../../../shared/presentation/components/LecteurBottomNav';

export const ProfileScreen = ({ navigation, route }: any) => {

    const { session, logout } = useAuth();

    const currentUserId = Number(session?.userId);

    const { profile, isLoading, error, refetch } = useUserProfile(currentUserId);

    const roleName = route?.params?.roleName;


    const unreadCount = Number(route?.params?.unreadCount ?? 0);




    const handleLogout = async () => {
        await logout();
    };
    const formatDate = (date?: Date) => {
        if (!date) return '-';

        try {
            return new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(date);
        } catch {
            return date.toDateString();
        }
    };

    const formatSince = (date?: Date) => {
        if (!date) return '-';

        try {
            return new Intl.DateTimeFormat('fr-FR', {
                month: 'long',
                year: 'numeric',
            }).format(date);
        } catch {
            return date.toDateString();
        }
    };

    const renderAvatar = () => {
        if (profile?.ImagePath) {
            return (
                <Image
                    source={{ uri: profile.ImagePath }}
                    style={styles.avatar}
                    resizeMode="cover"
                />
            );
        }

        return (
            <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                    {profile?.Initials || 'AG'}
                </Text>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Chargement du profil...</Text>
            </View>
        );
    }

    if (error || !profile) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error || 'Profil introuvable.'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                    <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>

                    <View style={styles.avatarWrapper}>
                        {renderAvatar()}
                        <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85}>
                            <Feather name="camera" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.name}>{profile.FullName}</Text>
                    <Text style={styles.email}>{profile.Email}</Text>

                    <View style={styles.roleBadge}>
                        <Feather name="shield" size={14} color="#FFFFFF" />
                        <Text style={styles.roleBadgeText}>
                            {String(profile.RoleName).toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile.id}</Text>
                        <Text style={styles.statLabel}>User ID</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {profile.IsActive ? 'Oui' : 'Non'}
                        </Text>
                        <Text style={styles.statLabel}>Actif</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statValueSmall}>
                            {formatSince(profile.CreatedAt)}
                        </Text>
                        <Text style={styles.statLabel}>Since</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACTIONS</Text>

                    <View style={styles.menuCard}>
                        <TouchableOpacity
                            style={styles.menuRow}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate(Routes.Agent.Alerts || Routes.Admin.Notifications)}
                        >
                            <View style={[styles.menuIconWrap, { backgroundColor: '#EDE9FE' }]}>
                                <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />
                            </View>

                            <View style={styles.menuTextWrap}>
                                <Text style={styles.menuTitle}>Notifications</Text>
                                <Text style={styles.menuSubTitle}>Voir vos alertes</Text>
                            </View>

                            <Feather name="chevron-right" size={20} color="#CBD5E1" />
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuRow}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate(Routes.Admin.Settings)}
                        >
                            <View style={[styles.menuIconWrap, { backgroundColor: '#DCFCE7' }]}>
                                <Feather name="settings" size={20} color="#16A34A" />
                            </View>

                            <View style={styles.menuTextWrap}>
                                <Text style={styles.menuTitle}>Security & Privacy</Text>
                                <Text style={styles.menuSubTitle}>Paramètres et sécurité</Text>
                            </View>

                            <Feather name="chevron-right" size={20} color="#CBD5E1" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AGENT INFORMATION</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>User ID</Text>
                            <Text style={styles.infoValue}>{profile.id}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Full Name</Text>
                            <Text style={styles.infoValue}>{profile.FullName}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{profile.Email}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Role</Text>
                            <Text style={styles.infoValue}>{profile.RoleName}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <Text
                                style={[
                                    styles.infoValue,
                                    { color: profile.IsActive ? '#16A34A' : '#DC2626' },
                                ]}
                            >
                                {profile.IsActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Created At</Text>
                            <Text style={styles.infoValue}>{formatDate(profile.CreatedAt)}</Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Updated At</Text>
                            <Text style={styles.infoValue}>{formatDate(profile.UpdatedAt)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerInfoText}>Intelligent Bureau d’Ordre v2.1.0</Text>
                    <Text style={styles.footerInfoSubText}>Agent Portal · Build 2026.03</Text>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    activeOpacity={0.88}
                    onPress={handleLogout}
                >
                    <Feather name="log-out" size={22} color="#FF0000" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {roleName === Roles.AGENT && (
                <AgentBottomNav
                    navigation={navigation}
                    active="profile"
                    unreadCount={unreadCount}
                    userId={currentUserId}
                />
            )}

            {roleName === Roles.LECTEUR && (
                <LecteurBottomNav
                    navigation={navigation}
                    active="profile"
                    unreadCount={unreadCount}
                    userId={currentUserId}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1B4B',
    },
    scrollContent: {
        paddingBottom: 110,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748B',
        fontWeight: '600',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    retryButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    header: {
        backgroundColor: '#4338CA',
        paddingTop: 36,
        paddingBottom: 92,
        alignItems: 'center',
    },
    topBar: {
        width: '100%',
        paddingHorizontal: 22,
        marginBottom: 14,
    },
    timeFake: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    avatarWrapper: {
        position: 'relative',
        marginTop: 8,
        marginBottom: 16,
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    avatarFallback: {
        width: 92,
        height: 92,
        borderRadius: 46,
        backgroundColor: '#C7D2FE',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarFallbackText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#4338CA',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: -2,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    name: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    email: {
        color: '#DDE7FF',
        marginTop: 6,
        fontSize: 16,
        fontWeight: '500',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.14)',
    },
    roleBadgeText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontWeight: '800',
        fontSize: 15,
    },
    statsCard: {
        marginTop: -62,
        marginHorizontal: 22,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        paddingVertical: 18,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
    },
    statValueSmall: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    statLabel: {
        marginTop: 6,
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '600',
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 22,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#94A3B8',
        marginBottom: 12,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 18,
    },
    menuIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuTextWrap: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 17,
        color: '#0F172A',
        fontWeight: '700',
    },
    menuSubTitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 4,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#EEF2F7',
        marginLeft: 78,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    infoLabel: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    infoValue: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '700',
        flex: 1.2,
        textAlign: 'left',
    },
    infoDivider: {
        height: 1,
        backgroundColor: '#EEF2F7',
        marginHorizontal: 20,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 22,
        paddingHorizontal: 22,
    },
    footerInfoText: {
        color: '#94A3B8',
        fontSize: 15,
        fontWeight: '500',
    },
    footerInfoSubText: {
        color: '#CBD5E1',
        fontSize: 14,
        marginTop: 4,
    },
    logoutButton: {
        marginTop: 22,
        marginHorizontal: 22,
        backgroundColor: '#FFF1F2',
        borderWidth: 1,
        borderColor: '#FECDD3',
        borderRadius: 22,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    logoutText: {
        marginLeft: 10,
        color: '#FF0000',
        fontSize: 18,
        fontWeight: '800',
    },
});