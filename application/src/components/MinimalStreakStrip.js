import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MinimalStreakStrip({ currentStreak, longestStreak, recentActivity, onPress }) {
  // recentActivity is an array of 10 booleans for the last 10 days, e.g., [true, false, true, true...]
  
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>STREAK</Text>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statUnit}>DAYS</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>LONGEST</Text>
            <Text style={styles.longestValue}>{longestStreak}D</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.rightSection}>
          <Text style={styles.activityLabel}>RECENT ACTIVITY</Text>
          <View style={styles.activityRow}>
            {recentActivity.map((isActive, index) => (
              <View 
                key={index}
                style={[
                  styles.activityBox,
                  isActive ? styles.activityBoxActive : styles.activityBoxInactive
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    // Removed borders and shadows to merge seamlessly with background
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statColumn: {
    flexDirection: 'col',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.5,
  },
  statValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#000000',
    lineHeight: 24,
  },
  statUnit: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#000000',
    textTransform: 'uppercase',
  },
  longestValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#000000',
    lineHeight: 24,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  rightSection: {
    alignItems: 'center',
  },
  activityLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.5,
    marginBottom: 4,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 2,
  },
  activityBox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 1,
  },
  activityBoxActive: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  activityBoxInactive: {
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.05)',
  }
});
