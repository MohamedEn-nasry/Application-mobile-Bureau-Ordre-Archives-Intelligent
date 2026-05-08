import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AssignedMailItem } from '../../domain/entities/AgentDashboard';

interface Props {
    item: AssignedMailItem;
    onPress: () => void;
}

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'inprogress':
            return { bg: '#E8F0FF', text: '#2563EB' };
        case 'pending':
            return { bg: '#FEF3C7', text: '#D97706' };
        case 'completed':
            return { bg: '#DCFCE7', text: '#059669' };
        default:
            return { bg: '#E2E8F0', text: '#475569' };
    }
};

export const AssignedMailCard: React.FC<Props> = ({ item, onPress }) => {
    const colors = statusColor(item.statut);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.rowBetween}>
                <Text style={styles.reference}>{item.reference}</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statusText, { color: colors.text }]}>
                        {item.statut}
                    </Text>
                </View>
            </View>

            <Text style={styles.objet}>{item.objet}</Text>

            <View style={styles.rowBetween}>
                <Text style={styles.expediteur}>{item.expediteur}</Text>
                <Text style={styles.date}>{item.dateCourrier}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 16,
        marginBottom: 14,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reference: {
        color: '#4F46E5',
        fontWeight: '800',
        fontSize: 14,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    objet: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    expediteur: {
        marginTop: 10,
        fontSize: 14,
        color: '#94A3B8',
    },
    date: {
        marginTop: 10,
        fontSize: 14,
        color: '#94A3B8',
    },
});