import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Routes } from '../../constants/routes';

type BottomNavProps = {
  navigation: any;
  activeRoute?: 'Accueil' | 'Courrier' | 'Utilisateurs' | 'Alertes' | 'Paramètres';
};

const navItems = [
  {
    key: 'Accueil',
    label: 'Accueil',
    icon: 'grid',
    route: Routes.Admin.Dashboard,
  },
  {
    key: 'Courrier',
    label: 'Courrier',
    icon: 'mail',
    route: Routes.Admin.CourrierOverview,
  },
  {
    key: 'Utilisateurs',
    label: 'Utilisateurs',
    icon: 'users',
    route: Routes.Admin.UsersList,
  },
  {
    key: 'Alertes',
    label: 'Alertes',
    icon: 'bell',
    route: Routes.Admin.Notifications,
  },
  {
    key: 'Paramètres',
    label: 'Paramètres',
    icon: 'settings',
    route: Routes.Admin.Settings,
  },
] as const;

export const BottomNav = ({
  navigation,
  activeRoute = 'Accueil',
}: BottomNavProps) => {
  return (
    <View style={styles.container}>
      {navItems.map(item => {
        const isActive = activeRoute === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.route)}
          >
            {isActive ? <View style={styles.activeLine} /> : null}

            <Feather
              name={item.icon}
              size={24}
              color={isActive ? '#1455ff' : '#94a3b8'}
            />

            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeLine: {
    position: 'absolute',
    top: 0,
    width: 42,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#1455ff',
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },

  labelActive: {
    color: '#1455ff',
    fontWeight: '900',
  },
});