import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

import { Routes } from '../../constants/routes';
import { Roles } from '../../constants/roles';

type LecteurTabKey = 'home' | 'courrier' | 'alerts' | 'profile';

interface Props {
    navigation: any;
    active?: LecteurTabKey;
    unreadCount?: number;
    userId?: number;
}

export const LecteurBottomNav: React.FC<Props> = ({
    navigation,
    active = 'home',
    unreadCount = 0,
    userId = 0,
}) => {
    const tabs = [
        {
            key: 'home' as LecteurTabKey,
            label: 'Accueil',
            routeName: Routes.Lecteur.Dashboard,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'grid' : 'grid-outline'}
                    size={23}
                    color={focused ? '#4e47e2' : '#93a2b6'}
                />
            ),
        },
        {
            key: 'courrier' as LecteurTabKey,
            label: 'Courrier',
            routeName: Routes.Lecteur.CourrierOverview,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'mail' : 'mail-outline'}
                    size={23}
                    color={focused ? '#4e47e2' : '#93a2b6'}
                />
            ),
        },
        {
            key: 'alerts' as LecteurTabKey,
            label: 'Alertes',
            routeName: Routes.Lecteur.Notifications,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'notifications' : 'notifications-outline'}
                    size={23}
                    color={focused ? '#4e47e2' : '#93a2b6'}
                />
            ),
            hasBadge: true,
        },
        {


            key: 'profile',
            label: 'Profile',
            routeName: Routes.Lecteur.Profile,
            params: {

                userId,
                roleName: Roles.LECTEUR,

            },
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'person' : 'person-outline'}
                    size={23}
                    color={focused ? '#2563EB' : '#93a2b6'}
                />
            ),
        },
    ];
    const goToRoute = (routeName: string, params?: any) => {
        navigation.navigate(routeName, {
            userId,
            roleName: Roles.LECTEUR,
            ...params,
        });
    };

    return (
        <View style={styles.container}>
            {tabs.map(tab => {
                const focused = active === tab.key;

                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.item}
                        activeOpacity={0.85}
                        onPress={() => goToRoute(tab.routeName, tab.params)}
                    >
                        <View style={styles.iconWrap}>
                            {tab.icon(focused)}

                            {tab.hasBadge && unreadCount > 0 ? (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </Text>
                                </View>
                            ) : null}
                        </View>

                        <Text style={[styles.label, focused && styles.labelActive]}>
                            {tab.label}
                        </Text>

                        {focused ? <View style={styles.activeDot} /> : null}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 82,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5EAF2',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 8,
        shadowColor: '#000000',
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
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
    },

    label: {
        marginTop: 4,
        color: '#93a2b6',
        fontSize: 12,
        fontWeight: '700',
    },

    labelActive: {
        color: '#4e47e2',
        fontWeight: '900',
    },

    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 999,
        backgroundColor: '#4e47e2',
        marginTop: 4,
    },

    badge: {
        position: 'absolute',
        top: -9,
        right: -12,
        minWidth: 20,
        height: 20,
        borderRadius: 999,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },

    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
    },
});