import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface LecteurCourrierCardItem {
    id: number;
    reference: string;
    objet: string;
    expediteur: string;
    dateCourrier: string;
    statut: string;
    texteOcr?: string | null;
    pieceJointeCount?: number;
}

interface Props {
    item: LecteurCourrierCardItem;
    onPress: () => void;
}

const getStatusColors = (status: string) => {
    const value = status?.toLowerCase()?.trim();

    if (
        value === 'entraiter' ||
        value === 'en traitement' ||
        value === 'inprogress' ||
        value === 'in progress'
    ) {
        return {
            bg: '#DBEAFE',
            text: '#2563EB',
            dot: '#3B82F6',
            label: 'En traitement',
        };
    }

    if (
        value === 'en attente' ||
        value === 'atraiter' ||
        value === 'pending'
    ) {
        return {
            bg: '#FEF3C7',
            text: '#D97706',
            dot: '#F59E0B',
            label: 'En attente',
        };
    }

    if (
        value === 'recu' ||
        value === 'reçu' ||
        value === 'traite' ||
        value === 'traité' ||
        value === 'completed'
    ) {
        return {
            bg: '#D1FAE5',
            text: '#059669',
            dot: '#10B981',
            label: 'Reçu',
        };
    }

    if (value === 'urgent') {
        return {
            bg: '#FEE2E2',
            text: '#DC2626',
            dot: '#EF4444',
            label: 'Urgent',
        };
    }

    if (value === 'archive' || value === 'archivé' || value === 'archived') {
        return {
            bg: '#E2E8F0',
            text: '#475569',
            dot: '#94A3B8',
            label: 'Archivé',
        };
    }

    return {
        bg: '#EDE9FE',
        text: '#6D28D9',
        dot: '#8B5CF6',
        label: status || 'Statut',
    };
};

const formatDate = (value: string) => {
    if (!value) return '';

    try {
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;

        const day = d.getDate().toString().padStart(2, '0');
        const months = [
            'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
            'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
        ];
        const month = months[d.getMonth()];
        const year = d.getFullYear();

        return `${day} ${month} ${year}`;
    } catch {
        return value;
    }
};

export const LecteurCourrierCard: React.FC<Props> = ({ item, onPress }) => {
    const statusUi = getStatusColors(item.statut);
    const hasFiles = (item.pieceJointeCount ?? 0) > 0;

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.92}
            onPress={onPress}
        >
            {/* Left accent border */}
            <View style={styles.accentBorder} />

            <View style={styles.cardContent}>
                {/* Top row: Reference + Status badge */}
                <View style={styles.topRow}>
                    <Text style={styles.referenceText}>{item.reference}</Text>

                    <View style={[styles.statusBadge, { backgroundColor: statusUi.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusUi.dot }]} />
                        <Text style={[styles.statusText, { color: statusUi.text }]}>
                            {statusUi.label}
                        </Text>
                    </View>
                </View>

                {/* Subject */}
                <Text style={styles.subject} numberOfLines={2}>
                    {item.objet}
                </Text>

                {/* Sender row */}
                <View style={styles.senderRow}>
                    <Feather name="check" size={14} color="#4F46E5" />
                    <Text style={styles.senderText} numberOfLines={1}>
                        {item.expediteur || 'Expéditeur non défini'}
                    </Text>
                </View>

                {/* Bottom row: Attachments + Date + Chevron */}
                <View style={styles.bottomRow}>
                    <View style={styles.metaRow}>
                        {hasFiles && (
                            <View style={styles.metaBadge}>
                                <Feather name="paperclip" size={12} color="#64748B" />
                                <Text style={styles.metaBadgeText}>
                                    {item.pieceJointeCount}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.dateText}>
                            {formatDate(item.dateCourrier)}
                        </Text>
                    </View>

                    <Feather name="chevron-right" size={18} color="#94A3B8" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 14,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },

    accentBorder: {
        width: 4,
        backgroundColor: '#4F46E5',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },

    cardContent: {
        flex: 1,
        padding: 16,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    referenceText: {
        color: '#4F46E5',
        fontWeight: '700',
        fontSize: 13,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 999,
        marginRight: 5,
    },

    statusText: {
        fontWeight: '700',
        fontSize: 12,
    },

    subject: {
        fontSize: 16,
        lineHeight: 22,
        color: '#0F172A',
        fontWeight: '700',
        marginBottom: 8,
    },

    senderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    senderText: {
        flex: 1,
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    metaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },

    metaBadgeText: {
        marginLeft: 4,
        color: '#64748B',
        fontSize: 13,
        fontWeight: '600',
    },

    dateText: {
        color: '#94A3B8',
        fontSize: 13,
        fontWeight: '600',
    },
});
