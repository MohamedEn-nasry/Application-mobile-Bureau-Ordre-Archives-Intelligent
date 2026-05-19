import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface OutgoingMailCardItem {
    id: number;
    reference: string;
    objet: string;
    destinataire: string;
    dateCourrier: string;
    statut: string;
    texteOcr?: string | null;
    pieceJointeCount?: number;
}

interface Props {
    item: OutgoingMailCardItem;
    onPress: () => void;
}

const getStatusColors = (status: string) => {
    const value = status?.toLowerCase()?.trim();

    if (value === 'envoye' || value === 'envoyé' || value === 'sent') {
        return { bg: '#D1FAE5', text: '#059669', dot: '#10B981', label: 'Sent' };
    }

    if (value === 'brouillon' || value === 'draft') {
        return { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B', label: 'Draft' };
    }

    if (value === 'valide' || value === 'validé' || value === 'validated') {
        return { bg: '#DBEAFE', text: '#2563EB', dot: '#3B82F6', label: 'Validated' };
    }

    if (value === 'archive' || value === 'archivé' || value === 'archived') {
        return { bg: '#E2E8F0', text: '#475569', dot: '#94A3B8', label: 'Archived' };
    }

    return { bg: '#EDE9FE', text: '#6D28D9', dot: '#8B5CF6', label: status || 'Status' };
};

const formatDate = (value: string) => {
    if (!value) return '';

    const d = new Date(value);
    if (isNaN(d.getTime())) return value;

    return d.toISOString().split('T')[0];
};

const getInitial = (destinataire: string) => {
    if (!destinataire) return 'D';
    return destinataire.trim().charAt(0).toUpperCase();
};

export const OutgoingMailCard: React.FC<Props> = ({ item, onPress }) => {
    const statusUi = getStatusColors(item.statut);
    const hasOcr = !!item.texteOcr?.trim();
    const hasFiles = (item.pieceJointeCount ?? 0) > 0;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
            <View style={styles.topRow}>
                <View style={styles.referenceBadge}>
                    <Text style={styles.referenceText}>{item.reference}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusUi.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusUi.dot }]} />
                    <Text style={[styles.statusText, { color: statusUi.text }]}>
                        {statusUi.label}
                    </Text>
                </View>
            </View>

            <Text style={styles.subject} numberOfLines={2}>
                {item.objet}
            </Text>

            <View style={styles.receiverRow}>
                <View style={styles.receiverInitialCircle}>
                    <Text style={styles.receiverInitialText}>
                        {getInitial(item.destinataire)}
                    </Text>
                </View>

                <Text style={styles.receiverText} numberOfLines={1}>
                    {item.destinataire || 'Destinataire non défini'}
                </Text>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.metaBadges}>
                    {hasFiles ? (
                        <View style={styles.metaBadge}>
                            <Feather name="paperclip" size={12} color="#64748B" />
                            <Text style={styles.metaBadgeText}>
                                {item.pieceJointeCount} {item.pieceJointeCount === 1 ? 'file' : 'files'}
                            </Text>
                        </View>
                    ) : null}

                    {hasOcr ? (
                        <View style={[styles.metaBadge, styles.ocrBadge]}>
                            <Text style={styles.ocrText}>OCR ✓</Text>
                        </View>
                    ) : null}
                </View>

                <Text style={styles.dateText}>{formatDate(item.dateCourrier)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    referenceBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    referenceText: {
        color: '#4F46E5',
        fontWeight: '800',
        fontSize: 14,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
        marginRight: 6,
    },
    statusText: {
        fontWeight: '700',
        fontSize: 13,
    },
    subject: {
        marginTop: 16,
        fontSize: 17,
        lineHeight: 24,
        color: '#0F172A',
        fontWeight: '800',
    },
    receiverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    receiverInitialCircle: {
        width: 24,
        height: 24,
        borderRadius: 999,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    receiverInitialText: {
        color: '#0EA5E9',
        fontSize: 12,
        fontWeight: '800',
    },
    receiverText: {
        flex: 1,
        color: '#64748B',
        fontSize: 15,
        fontWeight: '600',
    },
    bottomRow: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaBadges: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        marginRight: 8,
    },
    metaBadgeText: {
        marginLeft: 5,
        color: '#64748B',
        fontSize: 12,
        fontWeight: '600',
    },
    ocrBadge: {
        backgroundColor: '#FEF3C7',
    },
    ocrText: {
        color: '#D97706',
        fontSize: 12,
        fontWeight: '700',
    },
    dateText: {
        color: '#94A3B8',
        fontSize: 15,
        fontWeight: '700',
    },
});