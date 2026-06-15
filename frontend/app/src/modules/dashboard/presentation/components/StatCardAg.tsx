import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface Props {
    value: number | string;

    label?: string;
    subLabel?: string;

    title?: string;
    subtitle?: string;

    icon?: FeatherIconName;
    color?: string;
    backgroundColor?: string;
}

export const StatCard: React.FC<Props> = ({
    value,
    label,
    subLabel,
    title,
    subtitle,
    icon = 'inbox',
    color = '#4F46E5',
    backgroundColor = '#EEF2FF',
}) => {
    const displayLabel = label ?? title ?? '';
    const displaySubLabel = subLabel ?? subtitle ?? '';

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={[styles.iconBox, { backgroundColor }]}>
                    <Feather name={icon} size={22} color={color} />
                </View>

                <Feather name="arrow-up-right" size={16} color="#CBD5E1" />
            </View>

            <Text style={styles.value}>{value}</Text>

            <Text style={styles.label} numberOfLines={2}>
                {displayLabel}
            </Text>

            {displaySubLabel ? (
                <Text style={styles.subLabel} numberOfLines={1}>
                    {displaySubLabel}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 18,
        minHeight: 172,
        marginBottom: 16,

        shadowColor: '#0F172A',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 26,
    },

    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    value: {
        fontSize: 30,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.8,
        marginBottom: 5,
    },

    label: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '700',
        lineHeight: 20,
    },

    subLabel: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 4,
        fontWeight: '500',
    },
});