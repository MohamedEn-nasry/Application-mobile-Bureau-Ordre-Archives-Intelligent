import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RecentActivityItem } from '../../domain/entities/AgentDashboard';

const dotColor = (type: string) => {
    switch (type) {
        case 'assignment':
            return '#3B82F6';
        case 'ocr':
            return '#10B981';
        case 'status':
            return '#8B5CF6';
        case 'classification':
            return '#F59E0B';
        default:
            return '#94A3B8';
    }
};

export const ActivityItem: React.FC<{ item: RecentActivityItem }> = ({ item }) => {
    return (
        <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: dotColor(item.type) }]} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.timeLabel}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        marginRight: 12,
    },
    title: {
        flex: 1,
        color: '#0F172A',
        fontSize: 14,
    },
    time: {
        color: '#94A3B8',
        fontSize: 13,
    },
});