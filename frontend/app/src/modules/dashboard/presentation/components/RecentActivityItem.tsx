import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// IPA: /ri.sent æk.tIv.I.ti/ - Recent Activity (pronounced "ree-sent ak-tiv-i-tee")
// IPA: /aI.tEm/ - Item (pronounced "eye-tem")
// IPA: /taIm.stæmp/ - Timestamp (pronounced "time-stamp")

interface Props {
  activity: string;
  timestamp: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export const RecentActivityItem: React.FC<Props> = ({
  activity,
  timestamp,
  icon = 'time-outline',
  iconColor = '#64748B',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.activity}>{activity}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  activity: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
  },
});
