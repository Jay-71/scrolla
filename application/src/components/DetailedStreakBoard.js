import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetailedStreakBoard({ currentStreak, longestStreak, completedDatesMap }) {
  
  // Generate a calendar matrix for the last 35 days (5 weeks)
  const generateMatrix = () => {
    const matrix = [];
    const today = new Date();
    
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isActive = !!completedDatesMap[dateStr];
      
      matrix.push({
        dateStr,
        isActive,
      });
    }
    return matrix;
  };

  const matrixData = generateMatrix();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const totalLessons = Object.keys(completedDatesMap).length;

  return (
    <LinearGradient
      colors={['#FFF4E6', '#FFE8CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mergedContainer}
    >
      {/* Top Header Section */}
      <View style={styles.headerRow}>
        
        {/* Left Side: Streak Label & Number */}
        <View style={styles.streakInfo}>
          <Text style={styles.streakLabel}>STREAK</Text>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
        </View>
        
        <View style={styles.headerDivider} />
        
        {/* Right Side: Week Progress & Strip */}
        <View style={styles.weekInfoContainer}>
          <View style={styles.weekInfo}>
            <Text style={styles.weekLabel}>WEEK</Text>
            <Text style={styles.weekValue}>
              {new Date().getDay() === 0 ? 7 : new Date().getDay()}/7
            </Text>
          </View>

          <View style={styles.weekStrip}>
            {['M','T','W','T','F','S','S'].map((day, i) => {
              const isPastOrToday = i + 1 <= (new Date().getDay() === 0 ? 7 : new Date().getDay());
              return (
                <View 
                  key={i} 
                  style={[
                    styles.weekDayBox, 
                    isPastOrToday ? styles.weekDayActive : styles.weekDayInactive
                  ]}
                >
                  <Text style={[
                    styles.weekDayText,
                    isPastOrToday ? { color: '#FFE8CC' } : { color: '#000000' }
                  ]}>
                    {day}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>

      <View style={styles.horizontalDivider} />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>LONGEST</Text>
          <Text style={styles.statValue}>{longestStreak} DAYS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>LESSONS</Text>
          <Text style={styles.statValue}>{totalLessons}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>AVG TIME</Text>
          <Text style={styles.statValue}>15 MIN</Text> 
        </View>
      </View>

      <View style={styles.horizontalDivider} />

      {/* Matrix Section */}
      <View style={styles.matrixHeader}>
        <Text style={styles.matrixTitle}>ACTIVITY MATRIX</Text>
        <Text style={styles.matrixMonth}>{currentMonthName}</Text>
      </View>

      <View style={styles.matrixGrid}>
        {matrixData.map((day, idx) => (
          <View 
            key={idx}
            style={[
              styles.matrixCell,
              day.isActive ? styles.matrixCellActive : styles.matrixCellInactive
            ]}
          />
        ))}
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mergedContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },
  streakLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  streakNumber: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
    color: '#000000',
    lineHeight: 30,
  },
  headerDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginHorizontal: 8,
  },
  weekInfoContainer: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  weekInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weekLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  weekValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#000000',
  },
  weekStrip: {
    flexDirection: 'row',
    gap: 3, 
  },
  weekDayBox: {
    width: 16, 
    height: 16,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayActive: {
    backgroundColor: '#000000',
  },
  weekDayInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: 'rgba(0,0,0,0.3)',
  },
  weekDayText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 8,
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  statBlock: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
  },
  statLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  statValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#000000',
  },
  matrixHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  matrixMonth: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
    color: '#000000',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 3,
    maxWidth: (18 * 7) + (3 * 6), // 7 cols * 18px + 6 gaps * 3px
    alignSelf: 'center',
  },
  matrixCell: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 2,
  },
  matrixCellActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  matrixCellInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: 'rgba(0,0,0,0.2)',
  },
});
