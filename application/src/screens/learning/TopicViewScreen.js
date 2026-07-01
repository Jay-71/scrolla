import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Dimensions, ActivityIndicator, Animated, InteractionManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AtomCard from '../../components/atoms/AtomCard';
import { useTopicSWR } from '../../hooks/useTopicSWR';
import { auth } from '../../firebase/firebaseConfig';
import { logTopicCompletion } from '../../utils/streakTracker';

const { width, height } = Dimensions.get('window');

export default function TopicViewScreen({ route, navigation }) {
  const { topicId, title } = route.params;
  const { data: fetchedData, isLoading, error } = useTopicSWR(topicId);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Graceful fallback if SWR completely fails to load anything
  const topicData = fetchedData || (error ? {
    topic: title, 
    atoms: [{ 
      concept: "Connection Error", 
      content: "Failed to securely load this module. Please check your connection or wait for the Vercel edge cache.", 
      atom_type: "explanation" 
    }] 
  } : null);

  // Use useCallback to avoid stale closure issues
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderItem = useCallback(({ item, index }) => (
    <AtomCard 
      atom={item} 
      index={index} 
      total={topicData ? topicData.atoms.length : 0} 
      isVisible={index === currentIndex}
    />
  ), [topicData, currentIndex]);

  const keyExtractor = useCallback((item, index) => `atom-${index}`, []);

  if (isLoading || !topicData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00F5FF" />
        <Text style={{ color: '#00F5FF', marginTop: 16, fontFamily: 'Quicksand_700Bold' }}>Loading from Edge Network...</Text>
      </View>
    );
  }

  const progressWidth = ((currentIndex + 1) / Math.max(1, topicData.atoms.length)) * 100;

  return (
    <View style={styles.container}>
      
      {/* Top Header Overlay */}
      <View style={styles.headerContainer}>
        <BlurView intensity={60} tint="dark" style={styles.headerBlur}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#e2e0fc" />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
              <Text style={styles.moduleSubtitle}>MACHINE LEARNING</Text>
              <Text style={styles.moduleTitle} numberOfLines={1}>{topicData.topic}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          
          {/* Neon Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
          </View>
        </BlurView>
      </View>

      <FlatList
        data={topicData.atoms}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />

      {topicData && currentIndex === topicData.atoms.length - 1 && (
        <Animated.View style={styles.completeButtonWrapper}>
          <TouchableOpacity 
            style={styles.completeButton}
            activeOpacity={0.9}
            onPress={() => {
              // Instantly navigate to prevent UI freezing
              navigation.navigate('TopicReward', { title: topicData.topic, topicId, atomCount: topicData.atoms.length });
              
              // Run the heavy database updates asynchronously in the background
              InteractionManager.runAfterInteractions(async () => {
                try {
                  const stored = await AsyncStorage.getItem('completed_topics');
                  const completed = stored ? JSON.parse(stored) : [];
                  if (!completed.includes(topicId)) {
                    completed.push(topicId);
                    await AsyncStorage.setItem('completed_topics', JSON.stringify(completed));
                  }
                  
                  // Firestore Streak Tracking
                  if (auth.currentUser?.uid) {
                    await logTopicCompletion(auth.currentUser.uid, topicId);
                  }
                } catch (e) {
                  if (__DEV__) console.log('Failed to save progress', e);
                }
              });
            }}
          >
            <LinearGradient 
              colors={['#00F5FF', '#9D72FF']} 
              start={{x:0, y:0}} 
              end={{x:1, y:1}} 
              style={StyleSheet.absoluteFillObject} 
            />
            <Text style={styles.completeButtonText}>Complete Topic</Text>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060609',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerBlur: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 26, 46, 0.8)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333348',
  },
  headerTitles: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  moduleSubtitle: {
    fontSize: 10,
    color: '#c6c4d8',
    fontFamily: 'Quicksand_700Bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#1A1A2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00d1ff',
  },
  completeButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: width * 0.7,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    letterSpacing: 1,
  }
});
