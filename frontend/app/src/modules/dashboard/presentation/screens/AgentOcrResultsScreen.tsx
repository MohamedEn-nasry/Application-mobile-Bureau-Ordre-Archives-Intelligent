import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AgentBottomNav } from '../../../../shared/presentation/components/AgentBottomNav';
import { Routes } from '../../../../shared/constants/routes';
import { Roles } from '../../../../shared/constants/roles';
import { useThemeStyles } from '../../../../application/providers/ThemeProvider';
import { AgentOcrResult } from '../../domain/entities/AgentOcrResult';
import { useAgentOcrResults } from '../hooks/useAgentOcrResults';
import { useAuthSession } from '../../../auth/presentation/hooks/useAuthSession';

export const AgentOcrResultsScreen = ({ navigation, route }: any) => {
    const styles = useThemeStyles(localStyles);
    const { session } = useAuthSession();
    const currentUserId = Number(route?.params?.userId ?? session?.userId ?? 0);
    const currentRole = route?.params?.roleName || session?.role || Roles.AGENT;

    const {
        items,
        isLoading,
        error,
        refetch,
    } = useAgentOcrResults();

    const openCourrierDetail = (item: AgentOcrResult) => {
        navigation.navigate(Routes.Agent.CourrierDetail, {
            id: item.CourrierId,
            roleName: currentRole,
            userId: currentUserId,
        });
    };

    const renderItem = ({ item }: { item: AgentOcrResult }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => openCourrierDetail(item)}
            >
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.reference} numberOfLines={1}>
                            {item.Reference} - {item.Objet}
                        </Text>

                        <Text style={styles.meta}>
                            OCR completed • {formatDate(item.CreatedAt)}
                        </Text>
                    </View>

                    <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>
                            {Math.round(item.Confiance)}%
                        </Text>
                    </View>
                </View>

                <Text style={styles.ocrText} numberOfLines={5}>
                    {item.TexteExtrait || 'Aucun texte OCR extrait.'}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.typeBadge}>{item.Type}</Text>
                    <Text style={styles.openText}>Voir détail ›</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>

                <View>
                    <Text style={styles.title}>OCR Results</Text>
                    <Text style={styles.subtitle}>
                        {items.length} résultat(s) OCR
                    </Text>
                </View>
            </View>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>

                    <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                        <Text style={styles.retryText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {isLoading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyTitle}>Aucun résultat OCR</Text>
                            <Text style={styles.emptySubtitle}>
                                Les documents scannés apparaîtront ici.
                            </Text>
                        </View>
                    }
                />
            )}

            <AgentBottomNav
                navigation={navigation}
                active="dashboard"
                unreadCount={0}
                userId={currentUserId}
                roleName={currentRole}
            />
        </SafeAreaView>
    );
};

const formatDate = (date: Date) => {
    if (!date || Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingBottom: 82,
    },

    header: {
        backgroundColor: '#ffffff',
        paddingTop: 24,
        paddingBottom: 18,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#eef2f7',
        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        marginRight: 10,
    },

    backText: {
        fontSize: 38,
        color: '#334155',
    },

    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
    },

    subtitle: {
        marginTop: 4,
        color: '#64748b',
        fontWeight: '600',
    },

    listContent: {
        padding: 18,
        paddingBottom: 120,
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#e5eaf2',
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },

    reference: {
        color: '#0f172a',
        fontSize: 17,
        fontWeight: '900',
    },

    meta: {
        marginTop: 6,
        color: '#94a3b8',
        fontWeight: '700',
    },

    confidenceBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
    },

    confidenceText: {
        color: '#16a34a',
        fontWeight: '900',
        fontSize: 12,
    },

    ocrText: {
        marginTop: 14,
        color: '#334155',
        fontStyle: 'italic',
        lineHeight: 23,
    },

    footer: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    typeBadge: {
        color: '#2563eb',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        fontWeight: '900',
        overflow: 'hidden',
    },

    openText: {
        color: '#4f46e5',
        fontWeight: '900',
    },

    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorBox: {
        backgroundColor: '#fee2e2',
        margin: 18,
        padding: 14,
        borderRadius: 16,
    },

    errorText: {
        color: '#dc2626',
        fontWeight: '900',
        marginBottom: 10,
    },

    retryButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#2563eb',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },

    retryText: {
        color: '#ffffff',
        fontWeight: '900',
    },

    emptyBox: {
        alignItems: 'center',
        paddingTop: 80,
    },

    emptyTitle: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: '900',
    },

    emptySubtitle: {
        color: '#94a3b8',
        marginTop: 6,
        textAlign: 'center',
    },
});