import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface Props {
    label: string;
    icon: FeatherIconName;
    color?: string;
    backgroundColor?: string;
    onPress: () => void;
}

export const QuickActionCard: React.FC<Props> = ({
    label,
    icon,
    color = '#4F46E5',
    backgroundColor = '#EEF2FF',
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={[styles.iconBox, { backgroundColor }]}>
                <Feather name={icon} size={24} color={color} />
            </View>

            <Text style={styles.label} numberOfLines={2}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '23%',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#0F172A',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
    },

    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    label: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
        lineHeight: 17,
    },
});