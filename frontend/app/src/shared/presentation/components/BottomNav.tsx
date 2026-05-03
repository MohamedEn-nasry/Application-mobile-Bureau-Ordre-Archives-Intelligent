import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes } from '../../constants/routes';

type TabKey = 'dashboard' | 'courrier' | 'users' | 'alerts' | 'settings';

interface Props {
    active?: TabKey;
    navigation: any;
}

export const BottomNav: React.FC<Props> = ({
    active = 'dashboard',
    navigation,
}) => {
    const tabs = [
        {
            key: 'dashboard' as TabKey,
            label: 'Accueil',
            routeName: Routes.Admin.Dashboard,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'grid' : 'grid-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'courrier' as TabKey,
            label: 'Courrier',
            routeName: Routes.Admin.OutgoingCourrier,
            icon: (focused: boolean) => (
                <Feather
                    name="mail"
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'users' as TabKey,
            label: 'Utilisateurs',
            routeName: Routes.Admin.UsersList,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'people' : 'people-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'alerts' as TabKey,
            label: 'Alertes',
            routeName: 'Notifications', // بدّلها إلى Routes.Admin.Notifications إذا أضفتها في routes
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'notifications' : 'notifications-outline'}
                    size={22}
                    color={focused ? '#2563EB' : '#94A3B8'}
                />
            ),
        },
        {
            key: 'settings' as TabKey,
            label: 'Paramètres',
            routeName: Routes.Admin.Settings,
            icon: (focused: boolean) => (
                <Ionicons
                    name={focused ? 'settings' : 'settings-outline'}
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
    },
    activeIndicator: {
        position: 'absolute',
        top: -10,
        width: 34,
        height: 3,
        borderRadius: 999,
        backgroundColor: '#2563EB',
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