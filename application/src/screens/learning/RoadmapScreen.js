import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Animated, Easing, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const MODULES_DATA = [
  {
    id: 1,
    title: 'Introduction',
    desc: 'Understanding the ML Engineer role, core responsibilities, and how it compares to AI Engineering.',
    tags: ['General', 'Roles'],
    topics: [
      { id: 1, title: 'What is an ML Engineer?' },
      { id: 2, title: 'ML Engineer vs AI Engineer' },
      { id: 3, title: 'Skills and Responsibilities' }
    ]
  },
  {
    id: 2,
    title: 'Mathematical Foundations',
    desc: 'Calculus, linear algebra, discrete math, statistics, and probability. The math behind learning algorithms.',
    tags: ['Mathematics'],
    topics: [
      { id: 4, title: 'Derivatives, Partial Derivatives' },
      { id: 5, title: 'Chain rule of derivation' },
      { id: 6, title: 'Gradient, Jacobian, Hessian' },
      { id: 7, title: 'Matrix & Matrix Operations' },
      { id: 8, title: 'Scalars, Vectors, Tensors' },
      { id: 9, title: 'Singular Value Decomposition' },
      { id: 10, title: 'Determinants, inverse of Matrix' },
      { id: 11, title: 'Eigenvalues, Diagonalization' },
      { id: 12, title: 'Discrete Mathematics' },
      { id: 13, title: 'Basic concepts (Statistics)' },
      { id: 14, title: 'Descriptive Statistics' },
      { id: 15, title: 'Graphs & Charts' },
      { id: 16, title: 'Inferential Statistics' },
      { id: 17, title: 'Basics of Probability' },
      { id: 18, title: 'Bayes Theorem' },
      { id: 19, title: 'Random Variables, PDFs' },
      { id: 20, title: 'Types of Distribution' }
    ]
  },
  {
    id: 3,
    title: 'Programming Fundamentals',
    desc: 'Python syntax, OOP, data structures, and scientific computing libraries (Numpy, Pandas, Matplotlib, Seaborn).',
    tags: ['Python', 'Libraries'],
    topics: [
      { id: 21, title: 'Basic Syntax' },
      { id: 22, title: 'Variables and Data Types' },
      { id: 23, title: 'Data Structures' },
      { id: 24, title: 'Loops' },
      { id: 25, title: 'Conditionals' },
      { id: 26, title: 'Exceptions' },
      { id: 27, title: 'Functions, Builtin Functions' },
      { id: 28, title: 'Object Oriented Programming' },
      { id: 29, title: 'Numpy' },
      { id: 30, title: 'Pandas' },
      { id: 31, title: 'Matplotlib' },
      { id: 32, title: 'Seaborn' }
    ]
  },
  {
    id: 4,
    title: 'Data Collection & Sources',
    desc: 'Interacting with databases (SQL & NoSQL), scraping, calling web APIs, and handling structured formats.',
    tags: ['Data Engineering'],
    topics: [
      { id: 33, title: 'Databases (SQL, No-SQL)' },
      { id: 34, title: 'APIs and Web Scraping' },
      { id: 35, title: 'Data Formats (JSON, XML, CSV)' }
    ]
  },
  {
    id: 5,
    title: 'Data Cleaning & Preprocessing',
    desc: 'Handling missing values, scaling, normalization, feature encoding, and feature engineering.',
    tags: ['Preprocessing'],
    topics: [
      { id: 36, title: 'Missing values and Outliers' },
      { id: 37, title: 'Data normalization and Scaling' },
      { id: 38, title: 'Encoding Categorical variables' },
      { id: 39, title: 'Feature Engineering' }
    ]
  },
  {
    id: 6,
    title: 'Machine Learning Basics',
    desc: 'Supervised vs unsupervised paradigms, Scikit-Learn fundamentals, data splitting, cross-validation, and metrics.',
    tags: ['Machine Learning'],
    topics: [
      { id: 40, title: 'What is Machine Learning?' },
      { id: 41, title: 'Supervised vs Unsupervised' },
      { id: 42, title: 'Scikit-Learn (Sklearn)' },
      { id: 43, title: 'Train/Test Split' },
      { id: 44, title: 'Cross Validation' },
      { id: 45, title: 'Model Evaluation Metrics' },
      { id: 46, title: 'Overfitting and Underfitting' },
      { id: 47, title: 'Bias-Variance Tradeoff' }
    ]
  },
  {
    id: 7,
    title: 'Supervised Learning',
    desc: 'Classification and Regression algorithms: KNN, Logistic and Linear Regression, SVMs, Decision Trees, and GBMs.',
    tags: ['Supervised'],
    topics: [
      { id: 48, title: 'Linear Regression' },
      { id: 49, title: 'Logistic Regression' },
      { id: 50, title: 'Decision Trees' },
      { id: 51, title: 'Random Forest' },
      { id: 52, title: 'Support Vector Machines (SVM)' },
      { id: 53, title: 'K-Nearest Neighbors (KNN)' },
      { id: 54, title: 'Naive Bayes' },
      { id: 55, title: 'Gradient Boosting (XGBoost)' }
    ]
  },
  {
    id: 8,
    title: 'Unsupervised Learning',
    desc: 'Dimensionality reduction (PCA, Autoencoders), clustering (K-Means, Hierarchical), and anomaly detection.',
    tags: ['Unsupervised'],
    topics: [
      { id: 56, title: 'K-Means Clustering' },
      { id: 57, title: 'Hierarchical Clustering' },
      { id: 58, title: 'Principal Component Analysis (PCA)' },
      { id: 59, title: 'Autoencoders' },
      { id: 60, title: 'Isolation Forests (Anomaly Detection)' }
    ]
  },
  {
    id: 9,
    title: 'Deep Learning',
    desc: 'Neural Networks, backpropagation, CNNs, Recurrent Networks, Attention Mechanisms, and NLP.',
    tags: ['Deep Learning', 'NLP'],
    topics: [
      { id: 61, title: 'What is Deep Learning?' },
      { id: 62, title: 'Perceptrons, Multi-Layer Perceptrons (MLP)' },
      { id: 63, title: 'Activation functions' },
      { id: 64, title: 'Backpropagation & Gradient Descent' },
      { id: 65, title: 'Loss Functions' },
      { id: 66, title: 'Convolutional Neural Networks (CNNs)' },
      { id: 67, title: 'Recurrent Neural Networks (RNNs), LSTMs' },
      { id: 68, title: 'Transformers and Attention' },
      { id: 69, title: 'Natural Language Processing (NLP)' }
    ]
  },
  {
    id: 10,
    title: 'Reinforcement Learning',
    desc: 'Q-Learning, Policy Gradients, Actor-Critic, and reinforcement loop fundamentals.',
    tags: ['Reinforcement'],
    topics: [
      { id: 70, title: 'Reinforcement Learning Basics' }
    ]
  }
];

// Helper to determine status for our local MVP (only topics 1 & 2 are available)
const getTopicStatus = (topicId) => {
  if (topicId === 1) return 'completed';
  if (topicId === 2) return 'in-progress';
  return 'locked';
};

export default function RoadmapScreen({ navigation }) {
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  // Animation Values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current; 
  const entranceAnims = useRef(MODULES_DATA.map(() => new Animated.Value(0))).current;

  // Calculate Progress
  const totalTopics = 70;
  let completedCount = 0;
  MODULES_DATA.forEach(mod => {
    mod.topics.forEach(t => {
      if (getTopicStatus(t.id) === 'completed') completedCount++;
    });
  });
  // Show at least 1% so the orb looks alive
  const progressPercent = Math.max(1, Math.round((completedCount / totalTopics) * 100));

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

    // 2. Liquid Fill Animation
    const liquidFill = Animated.timing(liquidAnim, {
      toValue: progressPercent,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    liquidFill.start();

    // 3. Staggered Entrance Animation for Cards
    const staggerAnimations = MODULES_DATA.map((_, index) => {
      return Animated.timing(entranceAnims[index], {
        toValue: 1,
        duration: 600,
        delay: 100 * index, 
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
    });

    const stagger = Animated.stagger(100, staggerAnimations);
    stagger.start();

    return () => {
      floatLoop.stop();
      liquidFill.stop();
      stagger.stop();
    };

  }, []);

  const toggleModule = (id, isLocked) => {
    if (isLocked) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedModuleId(prev => prev === id ? null : id);
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
        <BlurView intensity={50} tint="light" style={styles.navBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#181f21" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Scrolla</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="#181f21" />
          </TouchableOpacity>
        </BlurView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            {MODULES_DATA.map((module, index) => {
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
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => toggleModule(module.id, isModuleLocked)}
                  >
                    <BlurView 
                      intensity={isModuleLocked ? 20 : 60} 
                      tint="light" 
                      style={[styles.glassCard, blobShape, isExpanded && { minHeight: undefined, paddingBottom: 24 }]}
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

                      {/* Expandable Sub-Topic Timeline */}
                      {isExpanded && (
                        <View style={styles.timelineContainer}>
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
                  </TouchableOpacity>
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
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
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
    padding: 32,
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
