import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Routes } from '../../constants/routes';
import { Roles } from '../../constants/roles';

type TabKey = 'dashboard' | 'incoming' | 'outgoing' | 'alerts' | 'profile';

interface Props {
    active?: TabKey;
    navigation: any;
    unreadCount?: number;
    userId?: number;
}

export const AgentBottomNav: React.FC<Props> = ({
    active = 'dashboard',
    navigation,
    unreadCount = 0,
    userId,
}) => {
    const tabs = [
        {
            key: 'dashboard' as TabKey,
            label: 'Dashboard',
            routeName: Routes.Agent.Dashboard,
            params: {
                roleName: Roles.AGENT,
                userId,
            },
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'grid' : 'grid-outline'}
                    size={23}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'incoming' as TabKey,
            label: 'Incoming',
            routeName: Routes.Agent.IncomingMail,
            params: {
                roleName: Roles.AGENT,
                userId,

            },
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'file-tray-full' : 'file-tray-full-outline'}
                    size={24}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'outgoing',
            label: 'Outgoing',
            routeName: Routes.Agent.OutgoingMail,
            params: {
                roleName: Roles.AGENT,
                userId,
            },
            icon: (focused: boolean) => (
                <Feather
                    name="send"
                    size={23}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'alerts' as TabKey,
            label: 'Alerts',
            routeName: Routes.Agent.Notifications,
            params: {
                roleName: Roles.AGENT,
                userId,
            },
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'notifications' : 'notifications-outline'}
                    size={24}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
            badgeCount: unreadCount,
        },
        {
            key: 'profile',
            label: 'Profile',
            routeName: Routes.Agent.Profile,
            params: {

                userId,
            },
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'person' : 'person-outline'}
                    size={23}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
    ];

    return (
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <View style={styles.wrapper}>
                {tabs.map(tab => {
                    const focused = active === tab.key;
                    const hasBadge =
                        tab.key === 'alerts' &&
                        typeof tab.badgeCount === 'number' &&
                        tab.badgeCount > 0;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.item}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate(tab.routeName, tab.params)}
                        >
                            <View style={styles.iconWrap}>
                                {focused ? <View style={styles.activeIndicator} /> : null}

                                {tab.icon(focused)}

                                {hasBadge ? (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                                        </Text>
                                    </View>
                                ) : null}
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
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.06)',
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
        minHeight: 30,
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
        right: -12,
        backgroundColor: '#EF4444',
        borderRadius: 999,
        minWidth: 20,
        height: 20,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },

    label: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        marginTop: 3,
    },

    labelActive: {
        color: '#2563EB',
        fontWeight: '800',
    },
});