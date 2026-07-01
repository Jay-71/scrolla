import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform, InteractionManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Image } from 'expo-image';
import { getStreakData, getTodayStr } from '../utils/streakTracker';
import MinimalStreakStrip from '../components/MinimalStreakStrip';
import DetailedStreakBoard from '../components/DetailedStreakBoard';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [streakData, setStreakData] = useState(null);
  const [showDetailedStreak, setShowDetailedStreak] = useState(false);

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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.displayName || 'Learner';
  const email = user?.email || 'No email attached';
  const photoURL = user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  const SettingItem = ({ icon, title, badge }) => (
    <TouchableOpacity style={styles.settingButton} activeOpacity={0.8}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#000000" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {badge && <Text style={styles.badgeText}>{badge}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#434847" />
      </View>
    </TouchableOpacity>
  );

  // Helper to get last 10 days array of booleans for minimal strip
  const getRecentActivity = () => {
    if (!streakData) return Array(10).fill(false);
    const activity = [];
    const today = new Date();
    for (let i = 9; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      activity.push(!!streakData.completedDates[dateStr]);
    }
    return activity;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {photoURL ? (
            <Image 
              source={{ uri: photoURL }} 
              style={styles.avatarImage} 
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.emailText}>{email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>STUDENT</Text>
          </View>
        </View>

        {/* Streak Board Section */}
        <View style={styles.streakSection}>
          <DetailedStreakBoard 
            currentStreak={streakData?.currentStreak || 0}
            longestStreak={streakData?.longestStreak || 0}
            completedDatesMap={streakData?.completedDates || {}}
          />
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          <SettingItem icon="options-outline" title="Learning Preferences" />
          <SettingItem icon="notifications-outline" title="Notifications" />
          <SettingItem icon="ribbon-outline" title="Subscription Plan" badge="PRO" />
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <Text style={styles.logoutText}>{isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fcf8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 + 16 : 16, // Safe area padding
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#fcf8f8',
    zIndex: 100,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#000000',
    letterSpacing: -0.5,
  },
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  profileCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#fcf8f8',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 24,
    // Brutalist Shadow
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 16,
    backgroundColor: '#000000',
  },
  avatarText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 40,
    color: '#ffffff',
  },
  nameText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 4,
  },
  emailText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 16,
    color: '#434847',
    marginBottom: 16,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#e5e2e1',
  },
  roleText: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 12,
    color: '#000000',
    letterSpacing: 1,
  },
  streakSection: {
    marginBottom: 24,
  },
  hideStreakBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#e5e2e1',
  },
  hideStreakText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#000000',
    letterSpacing: 1,
  },
  settingsList: {
    gap: 16,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fcf8f8',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#000000',
    textTransform: 'uppercase',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeText: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 12,
    color: '#434847',
    borderWidth: 1,
    borderColor: '#434847',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionsContainer: {
    marginTop: 48,
  },
  logoutButton: {
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#fcf8f8',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  logoutText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#000000',
    letterSpacing: 1,
  }
});
