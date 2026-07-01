// Cache bust to clear Metro Bundler SyntaxError cache
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Path, Rect, Circle, Ellipse, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');

const PATHS = [
  {
    id: 'ml',
    title: 'Machine Learning',
    description: 'Master data pipelines, predictive models, and deep neural architectures.',
    blueprintSubtitle: 'Logic & Intelligence',
    blueprintLabel: 'Advanced',
    icon: 'hardware-chip-outline',
    skills: ['Python & PyTorch', 'Deep Learning Architectures', 'Distributed Training', 'Computer Vision & NLP'],
    large: true,
    height: 200,
  },
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Engineer highly interactive, performant user interfaces.',
    blueprintSubtitle: 'Interfaces & UX',
    blueprintLabel: 'Core',
    icon: 'code-slash-outline',
    skills: ['React & Next.js', 'State Management', 'Web Performance'],
    large: false,
    height: 160,
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Design robust APIs and server-side logic.',
    blueprintSubtitle: 'Core Systems & APIs',
    blueprintLabel: 'Systems',
    icon: 'server-outline',
    skills: ['Go & Node.js', 'System Design', 'Microservices'],
    large: false,
    height: 180,
  },
  {
    id: 'mlops',
    title: 'MLOps',
    description: 'Bridge the gap between model creation and production deployment.',
    blueprintSubtitle: 'Deployment & Scaling',
    blueprintLabel: 'Scale',
    icon: 'git-network-outline',
    skills: ['Kubernetes & Docker', 'CI/CD Pipelines', 'Model Monitoring'],
    large: true,
    height: 220,
  },
];

export default function PathSelectionScreen({ navigation }) {
  const [variant, setVariant] = useState('standard'); // 'standard' | 'blueprint'

  const handleSelectPath = (pathId) => {
    navigation.navigate('Roadmap');
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBlur}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCROLLA</Text>
        
        {/* Small Top-Right Switcher */}
        <View style={styles.smallSwitcherContainer}>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => setVariant('standard')}
            style={[styles.smallSwitcherTab, variant === 'standard' && styles.smallSwitcherTabActive]}
          >
            <Text style={[styles.smallSwitcherText, variant === 'standard' && styles.smallSwitcherTextActive]}>STD</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => setVariant('blueprint')}
            style={[styles.smallSwitcherTab, variant === 'blueprint' && styles.smallSwitcherTabActive]}
          >
            <Text style={[styles.smallSwitcherText, variant === 'blueprint' && styles.smallSwitcherTextActive]}>BLU</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>CHOOSE YOUR PATH</Text>
          <Text style={styles.pageSubtitle}>
            Select a core engineering discipline to begin your rigorous technical curriculum. Each track requires unwavering dedication.
          </Text>
        </View>

        {/* Dynamic Cards Container */}
        {variant === 'standard' ? (
          <View style={styles.cardsContainer}>
            {PATHS.map((path) => (
              <AnimatedCard key={path.id} path={path} onSelect={() => handleSelectPath(path.id)} />
            ))}
          </View>
        ) : (
          <View style={styles.masonryContainer}>
            <View style={styles.masonryColumn}>
              <BlueprintCard path={PATHS[0]} onSelect={() => handleSelectPath(PATHS[0].id)} />
              <BlueprintCard path={PATHS[2]} onSelect={() => handleSelectPath(PATHS[2].id)} />
            </View>
            <View style={styles.masonryColumn}>
              <BlueprintCard path={PATHS[1]} onSelect={() => handleSelectPath(PATHS[1].id)} />
              <BlueprintCard path={PATHS[3]} onSelect={() => handleSelectPath(PATHS[3].id)} />
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

// -------------------------------------------------------------
// OPTIMIZED COMPONENTS (Hoisted to prevent unnecessary re-mounts)
// -------------------------------------------------------------

const AnimatedCard = ({ path, onSelect }) => {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 12,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
      speed: 15,
    }).start();
  };

  const translateX = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });
  const translateY = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });

  return (
    <Pressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onSelect}
    >
      <Animated.View style={[
        styles.brutalistCardWrapper, 
        { transform: [{ translateX }, { translateY }] }
      ]}>
      </Animated.View>

      <Animated.View style={[
        styles.brutalistCard, 
        { transform: [{ translateX }, { translateY }] }
      ]}>
        <LinearGradient 
          colors={['#ffffff', '#e2dede']} 
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={{ zIndex: 1, flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.cardTop}>
            <Ionicons name={path.icon} size={path.large ? 42 : 32} color="#000000" />
          </View>

          <View style={styles.cardMiddle}>
            <Text style={styles.cardTitle}>{path.title}</Text>
            <Text style={styles.cardDesc}>{path.description}</Text>
          </View>

          <View style={styles.skillsSection}>
            <Text style={styles.skillsHeader}>CORE SKILLS:</Text>
            {path.skills.map((skill, i) => (
              <View key={i} style={styles.skillRow}>
                <Text style={styles.skillBullet}>•</Text>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
      
      <View style={styles.brutalistShadow} pointerEvents="none" />
    </Pressable>
  );
};

const BlueprintCard = ({ path, onSelect }) => {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 12,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
      speed: 15,
    }).start();
  };

  const translateX = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
  const translateY = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });

  // Render the specific SVG background based on path.id
  const renderBlueprintBackground = () => {
    switch (path.id) {
      case 'ml':
        return (
          <Svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 200" width="100%" style={styles.svgBackground}>
            <Defs>
              <Pattern height="20" id="grid-ml" patternUnits="userSpaceOnUse" width="20">
                <Path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000000" strokeWidth="0.5"></Path>
              </Pattern>
            </Defs>
            <Rect fill="url(#grid-ml)" height="100%" width="100%"></Rect>
            <Circle cx="50" cy="150" fill="none" r="15" stroke="#000000" strokeWidth="2"></Circle>
            <Circle cx="150" cy="50" fill="none" r="15" stroke="#000000" strokeWidth="2"></Circle>
            <Circle cx="120" cy="120" fill="none" r="25" stroke="#000000" strokeDasharray="4 4" strokeWidth="1"></Circle>
            <Path d="M 50 150 L 120 120 L 150 50" fill="none" stroke="#000000" strokeWidth="1.5"></Path>
            <Path d="M 20 180 L 50 150 M 150 50 L 180 20" fill="none" stroke="#000000" strokeDasharray="2 2" strokeWidth="1"></Path>
          </Svg>
        );
      case 'frontend':
        return (
          <Svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 160" width="100%" style={styles.svgBackground}>
            <Defs>
              <Pattern height="10" id="grid-fe" patternUnits="userSpaceOnUse" width="10">
                <Circle cx="1" cy="1" fill="#000000" r="0.5"></Circle>
              </Pattern>
            </Defs>
            <Rect fill="url(#grid-fe)" height="100%" width="100%"></Rect>
            <Rect fill="none" height="120" stroke="#000000" strokeWidth="1.5" width="160" x="20" y="20"></Rect>
            <Rect fill="none" height="20" stroke="#000000" strokeDasharray="2 2" strokeWidth="1" width="140" x="30" y="30"></Rect>
            <Rect fill="none" height="70" stroke="#000000" strokeWidth="1" width="40" x="30" y="60"></Rect>
            <Rect fill="none" height="70" stroke="#000000" strokeWidth="1" width="90" x="80" y="60"></Rect>
            <Path d="M 0 80 L 20 80 M 180 80 L 200 80" fill="none" stroke="#000000" strokeWidth="0.5"></Path>
          </Svg>
        );
      case 'backend':
        return (
          <Svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 180" width="100%" style={styles.svgBackground}>
            <Defs>
              <Pattern height="40" id="grid-be" patternUnits="userSpaceOnUse" width="40">
                <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000000" strokeWidth="0.25"></Path>
              </Pattern>
            </Defs>
            <Rect fill="url(#grid-be)" height="100%" width="100%"></Rect>
            <Ellipse cx="140" cy="50" fill="none" rx="30" ry="10" stroke="#000000" strokeWidth="1.5"></Ellipse>
            <Path d="M 110 50 L 110 120 A 30 10 0 0 0 170 120 L 170 50" fill="none" stroke="#000000" strokeWidth="1.5"></Path>
            <Ellipse cx="140" cy="85" fill="none" rx="30" ry="10" stroke="#000000" strokeDasharray="2 2" strokeWidth="1"></Ellipse>
            <Path d="M 30 85 L 110 85" fill="none" stroke="#000000" strokeWidth="2"></Path>
            <Polygon fill="#000000" points="100,80 110,85 100,90"></Polygon>
            <Path d="M 30 50 L 30 120" fill="none" stroke="#000000" strokeDasharray="4 4" strokeWidth="1"></Path>
          </Svg>
        );
      case 'mlops':
        return (
          <Svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 220" width="100%" style={styles.svgBackground}>
            <Path d="M 0 40 L 40 40 L 60 60 L 140 60 L 160 80 L 200 80" fill="none" stroke="#000000" strokeWidth="1.5"></Path>
            <Path d="M 0 80 L 30 80 L 50 100 L 150 100 L 170 120 L 200 120" fill="none" stroke="#000000" strokeWidth="2"></Path>
            <Path d="M 0 120 L 20 120 L 40 140 L 160 140 L 180 160 L 200 160" fill="none" stroke="#000000" strokeWidth="1"></Path>
            <Circle cx="60" cy="60" fill="#000000" r="4"></Circle>
            <Circle cx="160" cy="80" fill="#000000" r="4"></Circle>
            <Circle cx="50" cy="100" fill="none" r="5" stroke="#000000" strokeWidth="1.5"></Circle>
            <Circle cx="170" cy="120" fill="none" r="5" stroke="#000000" strokeWidth="1.5"></Circle>
            <Rect fill="none" height="40" stroke="#000000" strokeDasharray="2 2" strokeWidth="1" width="40" x="80" y="80"></Rect>
          </Svg>
        );
      default:
        return null;
    }
  };

  return (
    <Pressable 
      style={{ marginBottom: 16 }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onSelect}
    >
      <Animated.View style={[
        styles.blueprintCard, 
        { height: path.height, transform: [{ translateX }, { translateY }] }
      ]}>
        <LinearGradient 
          colors={['#ffffff', '#f4f0f0']} 
          style={StyleSheet.absoluteFillObject} 
        />
        
        {/* Custom SVG Blueprint Illustration */}
        {renderBlueprintBackground()}
        
        <View style={styles.blueprintCardContent}>
          {/* Top Row: Icon Only */}
          <View style={[styles.blueprintCardTop, { justifyContent: 'flex-end' }]}>
            <Ionicons name={path.icon} size={24} color="#000000" />
          </View>
          
          {/* Bottom Row: Title and Subtitle */}
          <View style={styles.blueprintCardBottom}>
            <Text style={styles.blueprintCardTitle}>{path.title}</Text>
            <Text style={styles.blueprintCardSubtitle}>{path.blueprintSubtitle}</Text>
          </View>
        </View>
      </Animated.View>
      
      <View style={styles.blueprintShadow} pointerEvents="none" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf8f8',
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    backgroundColor: '#fcf8f8',
    zIndex: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fcf8f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    letterSpacing: 2,
    color: '#000000',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  pageHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 24,
    marginBottom: 24,
  },
  pageTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 36,
    color: '#1c1e1d',
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -1,
  },
  pageSubtitle: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 20,
    color: '#242726',
    lineHeight: 30,
  },
  
  // Switcher Styles
  smallSwitcherContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#fcf8f8',
    height: 32,
    width: 76,
  },
  smallSwitcherTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  smallSwitcherTabActive: {
    backgroundColor: '#000000',
  },
  smallSwitcherText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#000000',
  },
  smallSwitcherTextActive: {
    color: '#ffffff',
  },

  // Standard Variant Styles
  cardsContainer: {
    gap: 24,
  },
  brutalistCard: {
    borderWidth: 3,
    borderColor: '#575c5b',
    padding: 24,
    minHeight: 250,
    zIndex: 10,
    backgroundColor: '#ffffff',
  },
  brutalistShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#575c5b',
    top: 6,
    left: 6,
    zIndex: 1,
  },
  cardTop: {
    marginBottom: 16,
  },
  cardMiddle: {
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 18,
    color: '#242726',
    lineHeight: 26,
  },
  skillsSection: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 16,
  },
  skillsHeader: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 12,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  skillBullet: {
    color: '#242726',
    marginRight: 8,
    fontSize: 18,
    lineHeight: 22,
  },
  skillText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 16,
    color: '#242726',
    lineHeight: 22,
  },

  // Blueprint Variant Styles
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  masonryColumn: {
    width: '48%',
  },
  blueprintCard: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    zIndex: 10,
    overflow: 'hidden',
  },
  blueprintShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    top: 4,
    left: 4,
    zIndex: 1,
    marginBottom: 16,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4, // Set to 40% per user request
    zIndex: 1,
  },
  blueprintCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  blueprintCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  blueprintCardBottom: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  blueprintCardTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4,
  },
  blueprintCardSubtitle: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 12,
    color: '#434847',
    textAlign: 'center',
  }
});
