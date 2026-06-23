import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AtomCard from '../../components/atoms/AtomCard';
import { MLData } from '../../../assets/data/ML/dataIndex';

const { width, height } = Dimensions.get('window');

// A simple mapping from topic ID to the mocked json key
const getTopicDataKey = (id) => {
  const normalizedId = String(id).padStart(2, '0');
  if (normalizedId === '01') return '01_what_is_an_ml_engineer';
  if (normalizedId === '02') return '02_ml_engineer_vs_ai_engineer';
  return '01_what_is_an_ml_engineer'; // fallback
};

export default function TopicViewScreen({ route, navigation }) {
  const { topicId, title } = route.params;
  const [topicData, setTopicData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const dataKey = getTopicDataKey(topicId);
    if (MLData[dataKey]) {
      setTopicData(MLData[dataKey]);
    } else {
      setTopicData({ topic: title, atoms: [] });
    }
  }, [topicId, title]);

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

  if (!topicData) return <View style={styles.container} />;

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
  }
});
