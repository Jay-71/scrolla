import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Animated, Easing, LayoutAnimation, UIManager, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useFocusEffect } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export default function RoadmapScreen({ navigation }) {
  const [modulesData, setModulesData] = useState([]);
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current; 
  const [entranceAnims, setEntranceAnims] = useState([]);

  const scrollViewRef = useRef(null);
  const moduleLayouts = useRef({});

  const [completedTopics, setCompletedTopics] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadCompleted = async () => {
        try {
          const stored = await AsyncStorage.getItem('completed_topics');
          if (stored) {
            setCompletedTopics(JSON.parse(stored));
          }
        } catch (e) {
          if (__DEV__) console.log(e);
        }
      };
      loadCompleted();
    }, [])
  );

  const allTopics = modulesData.flatMap(m => m.topics);

  const getTopicStatus = (topicId) => {
    if (completedTopics.includes(topicId)) return 'completed';
    // For now, keep everything unlocked (in-progress)
    return 'in-progress';
  };

  // Calculate Progress dynamically
  const totalTopics = allTopics.length || 1; // prevent div by zero
  const completedCount = completedTopics.length;
  const progressPercent = Math.min(100, Math.max(0, Math.round((completedCount / totalTopics) * 100)));

  // Fetch Modules from CDN (SWR caching strategy)
  useEffect(() => {
    let isMounted = true;
    const fetchModules = async () => {
      try {
        const cacheKey = 'cache_roadmap_modules';
        const url = 'https://scrolla-content.vercel.app/ML/roadmap_modules.json';
        
        const cachedStr = await AsyncStorage.getItem(cacheKey);
        if (cachedStr && isMounted) {
          const parsed = JSON.parse(cachedStr);
          setModulesData(parsed);
          setEntranceAnims(parsed.map(() => new Animated.Value(0)));
        }

        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          if (text !== cachedStr) {
            await AsyncStorage.setItem(cacheKey, text);
            if (isMounted) {
              const parsed = JSON.parse(text);
              setModulesData(parsed);
              setEntranceAnims(parsed.map(() => new Animated.Value(0)));
            }
          }
        }
      } catch (err) {
        if (__DEV__) console.error('Failed to load roadmap modules:', err);
      }
    };
    fetchModules();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // 1. Float Animation (Orb) - Continuous Loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    );
    floatLoop.start();

    return () => floatLoop.stop();
  }, []);

  useEffect(() => {
    // 2. Liquid Fill Animation
    const liquidFill = Animated.timing(liquidAnim, {
      toValue: progressPercent,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    liquidFill.start();
    return () => liquidFill.stop();
  }, [progressPercent]);

  useEffect(() => {
    // 3. Staggered Entrance Animation for Cards
    if (entranceAnims.length > 0 && modulesData.length > 0) {
      const staggerAnimations = modulesData.map((_, index) => {
        return Animated.timing(entranceAnims[index], {
          toValue: 1,
          duration: 600,
          delay: 100 * index, 
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        });
      });
      Animated.stagger(100, staggerAnimations).start();
    }
  }, [entranceAnims, modulesData.length]);

  const prefetchTopicAssets = async (topicId) => {
    try {
      // 1. Fetch index to resolve filename
      const indexUrl = 'https://scrolla-content.vercel.app/ML/index.json';
      const cachedIndex = await AsyncStorage.getItem('cache_ml_index');
      let indexData = cachedIndex ? JSON.parse(cachedIndex) : null;
      
      if (!indexData) {
        const res = await fetch(indexUrl);
        indexData = await res.json();
        await AsyncStorage.setItem('cache_ml_index', JSON.stringify(indexData));
      }

      const topicMeta = indexData.topics.find(t => t.id === Number(topicId));
      if (!topicMeta) return;

      // 2. Fetch topic payload
      const topicUrl = `https://scrolla-content.vercel.app/ML/${topicMeta.file}`;
      const topicCacheKey = `cache_topic_${topicId}`;
      const cachedTopic = await AsyncStorage.getItem(topicCacheKey);
      
      let topicData = cachedTopic ? JSON.parse(cachedTopic) : null;
      
      if (!topicData) {
        const res = await fetch(topicUrl);
        const text = await res.text();
        await AsyncStorage.setItem(topicCacheKey, text);
        topicData = JSON.parse(text);
      }

      // 3. Deep asset prefetching (Predicting ImageBackground URLs based on our pseudo-random seed logic)
      if (topicData && topicData.atoms) {
        topicData.atoms.forEach((atom, index) => {
          const bgType = ['lottie', 'image', 'blob'][index % 3];
          if (bgType === 'image' && atom.concept) {
             const seed = atom.concept.length * 12345;
             const imageUrl = `https://picsum.photos/seed/${seed}/800/1200`;
             Image.prefetch(imageUrl).catch(() => {}); // silently preload into OS cache
          }
        });
      }
    } catch (err) {
       if (__DEV__) console.log('Background prefetch silently failed:', err);
    }
  };

  const toggleModule = (id, isLocked) => {
    if (isLocked) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedModuleId(prev => {
      const nextId = prev === id ? null : id;
      // Trigger deep prefetch for the first topic in the expanded module
      if (nextId) {
        if (scrollViewRef.current && moduleLayouts.current[nextId] !== undefined) {
          setTimeout(() => {
            scrollViewRef.current.scrollTo({ y: moduleLayouts.current[nextId], animated: true });
          }, 100);
        }
        const mod = modulesData.find(m => m.id === nextId);
        if (mod && mod.topics.length > 0) {
          prefetchTopicAssets(mod.topics[0].id);
        }
      }
      return nextId;
    });
  };

  const orbTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });
  const orbRotate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg']
  });

  return (
    <View style={styles.container}>
      {/* Vibrant Animated Background */}
      <LinearGradient
        colors={['rgba(0,245,255,0.2)', 'rgba(157,114,255,0.1)', 'rgba(255,184,0,0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top App Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="#181f21" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Scrolla</Text>
          <TouchableOpacity style={styles.iconButton} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Ionicons name="menu" size={24} color="#181f21" />
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Energy Orb Progress Section */}
          <View style={styles.orbSection}>
            <Animated.View style={[
              styles.orbWrapper,
              { transform: [{ translateY: orbTranslateY }, { rotate: orbRotate }] }
            ]}>
              <View style={styles.orbClip}>
                <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill}>
                  <Animated.View style={[
                    styles.orbFillContainer,
                    { 
                      height: liquidAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%']
                      }) 
                    }
                  ]}>
                    <LinearGradient
                      colors={['#00F5FF', '#9D72FF']}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.liquidFill}
                    />
                    <View style={styles.liquidEdge} />
                  </Animated.View>
                </BlurView>
              </View>

              <View style={styles.orbContent}>
                <Text style={styles.orbPercentage}>{progressPercent}%</Text>
                <Text style={styles.orbLabel}>COMPLETE</Text>
              </View>
            </Animated.View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Machine Learning Roadmap</Text>
              <Text style={styles.headerSubtitle}>
                Your fluid journey through the neural pathways of artificial intelligence. Foundations are the roots of your growth.
              </Text>
            </View>
          </View>

          {/* Bento Grid / Modules */}
          <View style={styles.grid}>
            {modulesData.map((module, index) => {
              const isModuleCompleted = module.topics.every(t => getTopicStatus(t.id) === 'completed');
              const isModuleLocked = module.topics.every(t => getTopicStatus(t.id) === 'locked');
              const isModuleInProgress = !isModuleCompleted && !isModuleLocked;
              const isExpanded = expandedModuleId === module.id;

              const blobShape = 
                index % 3 === 0 ? styles.blobShape1 : 
                index % 3 === 1 ? styles.blobShape2 : 
                styles.blobShape3;

              if (!entranceAnims[index]) return null;

              const cardOpacity = entranceAnims[index];
              const cardTranslateY = entranceAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              });

              return (
                <Animated.View
                  key={module.id}
                  onLayout={(e) => {
                    moduleLayouts.current[module.id] = e.nativeEvent.layout.y;
                  }}
                  style={[
                    styles.cardWrapper, 
                    blobShape, 
                    isModuleLocked && styles.cardLocked,
                    {
                      opacity: cardOpacity,
                      transform: [{ translateY: cardTranslateY }]
                    }
                  ]}
                >
                  <BlurView 
                    intensity={isModuleLocked ? 20 : 60} 
                    tint="light" 
                    style={[styles.glassCard, blobShape, isExpanded && { minHeight: undefined, paddingBottom: 24 }]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => toggleModule(module.id, isModuleLocked)}
                      style={{ padding: 32, paddingBottom: isExpanded ? 16 : 32 }}
                    >
                      <View style={styles.statusIconContainer}>
                        {isModuleCompleted && (
                          <View style={styles.iconCompleted}>
                            <Ionicons name="checkmark" size={24} color="#181f21" />
                          </View>
                        )}
                        {isModuleInProgress && (
                          <View style={styles.iconInProgress}>
                            <Ionicons name="play" size={24} color="#9D72FF" />
                          </View>
                        )}
                        {isModuleLocked && (
                          <View style={styles.iconLocked}>
                            <Ionicons name="lock-closed" size={20} color="#747879" />
                          </View>
                        )}
                      </View>

                      <Text style={styles.moduleLabel}>MODULE {String(module.id).padStart(2, '0')}</Text>
                      <Text style={[styles.moduleTitle, isModuleLocked && { color: '#434749' }]}>{module.title}</Text>
                      {!isExpanded && <Text style={styles.moduleDesc}>{module.desc}</Text>}

                      {!isExpanded && module.tags && module.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                          {module.tags.map(tag => (
                            <View key={tag} style={styles.tagBadge}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {!isExpanded && isModuleInProgress && (
                        <View style={styles.ctaButton}>
                          <Text style={styles.ctaText}>Continue Learning</Text>
                          <Ionicons name="arrow-down" size={16} color="#181f21" />
                        </View>
                      )}
                    </TouchableOpacity>

                      {/* Expandable Sub-Topic Timeline */}
                      {isExpanded && (
                        <View style={[styles.timelineContainer, { paddingHorizontal: 32 }]}>
                          <Text style={styles.moduleDescExpanded}>{module.desc}</Text>
                          
                          {module.topics.map((t, tIndex) => {
                            const tStatus = getTopicStatus(t.id);
                            const isTLast = tIndex === module.topics.length - 1;
                            
                            return (
                              <TouchableOpacity 
                                key={t.id} 
                                style={styles.topicItem} 
                                activeOpacity={tStatus === 'locked' ? 1 : 0.7}
                                onPress={() => {
                                  if (tStatus !== 'locked') {
                                    navigation.navigate('TopicView', { topicId: t.id, title: t.title });
                                  }
                                }}
                              >
                                <View style={styles.timelineCol}>
                                  <View style={[styles.timelineLine, isTLast && styles.timelineLineHidden]} />
                                  <View style={[styles.timelineDot, 
                                    tStatus === 'completed' ? styles.dotCompleted : 
                                    tStatus === 'in-progress' ? styles.dotInProgress : 
                                    styles.dotLocked]}
                                  >
                                    {tStatus === 'completed' && <Ionicons name="checkmark" size={12} color="#181f21" />}
                                    {tStatus === 'in-progress' && <Ionicons name="play" size={10} color="#9D72FF" style={{marginLeft: 2}} />}
                                    {tStatus === 'locked' && <Ionicons name="lock-closed" size={10} color="#747879" />}
                                  </View>
                                </View>
                                
                                <View style={styles.topicContent}>
                                  <Text style={styles.topicNum}>TOPIC {String(t.id).padStart(2, '0')}</Text>
                                  <Text style={[styles.topicName, tStatus === 'locked' && { color: '#747879' }]}>{t.title}</Text>
                                  {tStatus !== 'locked' && (
                                    <View style={styles.topicAction}>
                                      <Text style={styles.topicActionText}>{tStatus === 'completed' ? 'Review' : 'Start'}</Text>
                                      <Ionicons name="arrow-forward" size={12} color="#181f21" />
                                    </View>
                                  )}
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                  </BlurView>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf9f8',
  },
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: Platform.OS === 'android' ? 64 + 40 : 64, // 40px approximate safe area height for android
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 100,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 24,
    fontFamily: 'Quicksand_700Bold',
    color: '#181f21',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  orbSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  orbWrapper: {
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  orbClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 96,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  orbFillContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  liquidFill: {
    ...StyleSheet.absoluteFillObject,
  },
  liquidEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  orbContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  orbPercentage: {
    fontSize: 48,
    fontFamily: 'Quicksand_700Bold',
    color: '#181f21',
  },
  orbLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand_700Bold',
    color: '#9D72FF',
    letterSpacing: 2,
    marginTop: 4,
  },
  headerTextContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#181f21',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand_400Regular',
    color: '#434749',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  grid: {
    gap: 32,
  },
  cardWrapper: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 3,
  },
  blobShape1: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 80,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 50,
  },
  blobShape2: {
    borderTopLeftRadius: 90,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 100,
  },
  blobShape3: {
    borderTopLeftRadius: 70,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 90,
  },
  glassCard: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.4)',
    minHeight: 240,
  },
  cardLocked: {
    opacity: 0.6,
  },
  statusIconContainer: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 10,
  },
  iconCompleted: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F5FF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  iconInProgress: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#9D72FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLocked: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(116,120,121,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand_700Bold',
    color: '#4f6359',
    letterSpacing: 2,
    marginBottom: 16,
  },
  moduleTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#181f21',
    marginBottom: 16,
    maxWidth: '85%',
  },
  moduleDesc: {
    fontSize: 16,
    fontFamily: 'Quicksand_400Regular',
    color: '#434749',
    lineHeight: 24,
    marginBottom: 24,
  },
  moduleDescExpanded: {
    fontSize: 14,
    fontFamily: 'Quicksand_400Regular',
    color: '#434749',
    lineHeight: 22,
    marginBottom: 24,
    marginTop: -8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(207,229,217,0.5)',
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Quicksand_700Bold',
    color: '#54675e',
  },
  ctaButton: {
    marginTop: 24,
    backgroundColor: 'rgba(255,184,0,0.1)',
    borderColor: 'rgba(255,184,0,0.3)',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: '#181f21',
    fontSize: 16,
    fontFamily: 'Quicksand_700Bold',
  },
  timelineContainer: {
    marginTop: 16,
  },
  topicItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineLine: {
    position: 'absolute',
    top: 24,
    bottom: -16,
    width: 2,
    backgroundColor: 'rgba(24,31,33,0.1)',
  },
  timelineLineHidden: {
    backgroundColor: 'transparent',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcf9f8',
  },
  dotCompleted: {
    backgroundColor: '#00F5FF',
    borderWidth: 0,
  },
  dotInProgress: {
    borderWidth: 2,
    borderColor: '#9D72FF',
  },
  dotLocked: {
    borderWidth: 2,
    borderColor: 'rgba(116,120,121,0.3)',
  },
  topicContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  topicNum: {
    fontSize: 10,
    fontFamily: 'Quicksand_700Bold',
    color: '#9D72FF',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  topicName: {
    fontSize: 16,
    fontFamily: 'Quicksand_700Bold',
    color: '#181f21',
  },
  topicAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  topicActionText: {
    fontSize: 12,
    fontFamily: 'Quicksand_700Bold',
    color: '#181f21',
  }
});
