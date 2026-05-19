import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes } from '../../../../shared/constants/routes';

type TabKey = 'dashboard' | 'incoming' | 'outgoing' | 'alerts' | 'profile';

interface Props {
    active?: TabKey;
    navigation: any;
}

export const AgentBottomNav: React.FC<Props> = ({
    active = 'dashboard',
    navigation,
}) => {
    const tabs = [
        {
            key: 'dashboard' as TabKey,
            label: 'Dashboard',
            routeName: Routes.Agent.Dashboard,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'grid' : 'grid-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'incoming' as TabKey,
            label: 'Incoming',
            routeName: 'IncomingMail', // Will be added to routes later
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'mail' : 'mail-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'outgoing' as TabKey,
            label: 'Outgoing',
            routeName: 'OutgoingMail', // Will be added to routes later
            icon: (focused: boolean) => (
                <Feather
                    name="send"
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'alerts' as TabKey,
            label: 'Alerts',
            routeName: 'AgentAlerts', // Will be added to routes later
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'notifications' : 'notifications-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
            hasBadge: true,
            badgeCount: 3,
        },
        {
            key: 'profile' as TabKey,
            label: 'Profile',
            routeName: 'AgentProfile', // Will be added to routes later
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'person' : 'person-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
    ];

    return (
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <View style={styles.wrapper}>
                {tabs.map((tab) => {
                    const focused = active === tab.key;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.item}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate(tab.routeName)}
                        >
                            <View style={styles.iconWrap}>
                                {focused && <View style={styles.activeIndicator} />}
                                {tab.icon(focused)}
                                {tab.hasBadge && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {tab.badgeCount}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <Text style={[styles.label, focused && styles.labelActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#FFFFFF',
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 8,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 12,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        top: -10,
        width: 34,
        height: 3,
        borderRadius: 999,
        backgroundColor: '#2563EB',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    label: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500',
        marginTop: 4,
    },
    labelActive: {
        color: '#2563EB',
        fontWeight: '700',
    },
});
