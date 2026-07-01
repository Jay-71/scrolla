import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, InteractionManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebaseConfig';
import { getStreakData } from '../utils/streakTracker';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [streakData, setStreakData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      const task = InteractionManager.runAfterInteractions(() => {
        getStreakData(user.uid).then((data) => {
          setStreakData(data);
        }).catch(err => console.error(err));
      });
      return () => task.cancel();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon} />
            <Text style={styles.logoText}>SCROLLA</Text>
          </View>
          
          <View style={styles.headerRight}>
            {streakData && streakData.currentStreak > 0 && (
              <TouchableOpacity 
                style={styles.streakBadge}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.streakBadgeText}>{streakData.currentStreak} 🔥</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={20} color="#121515" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Bite-Sized Knowledge.</Text>
          <Text style={styles.heroSubtitle}>Swipe through short, dopamine-optimized 'Atoms' to master complex topics in minutes.</Text>
          
          <TouchableOpacity 
            style={styles.ctaButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PathSelection')}
          >
            <Text style={styles.ctaText}>START LEARNING</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{marginLeft: 8}}/>
          </TouchableOpacity>
        </View>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Card 1 */}
          <View style={[styles.bentoCard, styles.bentoFull]}>
            <Ionicons name="layers-outline" size={24} color="#121515" style={{marginBottom: 12}} />
            <Text style={styles.cardTitle}>Atomic Learning</Text>
            <Text style={styles.cardDesc}>
              Big ideas, bite-sized delivery. Master complex concepts in seconds without the cognitive overload.
            </Text>
          </View>
          
          {/* Row */}
          <View style={styles.bentoRow}>
            {/* Card 2 */}
            <View style={[styles.bentoCard, styles.bentoHalf]}>
              <Ionicons name="phone-portrait-outline" size={24} color="#121515" style={{marginBottom: 12}} />
              <Text style={styles.cardTitle}>Vertical Feed</Text>
              <Text style={styles.cardDesc}>
                Scroll to learn. A fluid interface engineered for pure focus and zero fluff.
              </Text>
            </View>
            
            {/* Card 3 */}
            <View style={[styles.bentoCard, styles.bentoHalf]}>
              <Ionicons name="bulb-outline" size={24} color="#121515" style={{marginBottom: 12}} />
              <Text style={styles.cardTitle}>Mental Models</Text>
              <Text style={styles.cardDesc}>
                Rewire your intuition. Vivid analogies that make abstract logic instantly click.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5ebe0',
  },
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#121515',
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#121515',
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  streakBadgeText: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#121515',
  },
  profileBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#575c56',
    borderRadius: 20,
  },
  hero: {
    marginBottom: 60,
  },
  heroTitle: {
    fontSize: 48,
    fontFamily: 'Outfit_700Bold',
    color: '#121515',
    lineHeight: 52,
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    fontFamily: 'Quicksand_600SemiBold',
    color: '#575c56',
    lineHeight: 26,
    marginBottom: 32,
    maxWidth: '85%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121515',
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    // Metallic elevation effect
    shadowColor: '#121515',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Quicksand_700Bold',
    letterSpacing: 1.5,
  },
  bentoGrid: {
    gap: 16,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoCard: {
    backgroundColor: 'rgba(255,255,255,0.6)', 
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',     // Light grey border to gently define the edges
    borderRadius: 16,                         
    padding: 24,
    justifyContent: 'space-between',
  },
  bentoFull: {
    width: '100%',
  },
  bentoHalf: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#121515',
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#2a2f2c',
    lineHeight: 24,
  },
});
