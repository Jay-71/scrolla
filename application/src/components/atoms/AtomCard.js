import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import LottieBackground from './LottieBackground';
import ImageBackground from './ImageBackground';
import BlobBackground from './BlobBackground';
import GenerativeArt from './GenerativeArt';
import { ExplanationCard, MentalModelCard, KeyPointsCard, QuickCheckCard, DefaultCard } from './CardTypes';

const { width, height } = Dimensions.get('window');

// Algorithmic generator for infinite distinct dark theme gradients
const generateDarkGradient = (index) => {
  // Use golden ratio conjugate (137.5) to spread hues wildly so adjacent cards have totally different colors
  const hue = (index * 137.508) % 360;
  
  // High saturation for vibrancy, low lightness to keep it a "dark theme"
  const topColor = `hsl(${hue}, 80%, 15%)`;
  const midColor = `hsl(${(hue + 45) % 360}, 90%, 25%)`; // Shift hue slightly for the gradient body
  const bottomColor = `hsl(${(hue - 25 + 360) % 360}, 70%, 10%)`;
  
  return [topColor, midColor, bottomColor];
};

const typeComponents = {
  explanation: ExplanationCard,
  mental_model: MentalModelCard,
  key_points: KeyPointsCard,
  quick_check: QuickCheckCard,
};

const typeLabels = {
  explanation: '📖 Concept',
  mental_model: '💡 Mental Model',
  key_points: '🔑 Key Points',
  quick_check: '✦ Quick Check',
};

const AtomCard = React.memo(function AtomCard({ atom, index, total, isVisible }) {
  const TypeCard = typeComponents[atom.atom_type] || DefaultCard;

  // Consistent background per card (deterministic based on index, not random)
  const bgType = useMemo(() => {
    const types = ['lottie', 'image', 'blob'];
    return types[index % 3];
  }, [index]);

  const baseGradient = useMemo(() => generateDarkGradient(index), [index]);

  // Animations
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      cardAnim.setValue(0);
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
    return () => cardAnim.stopAnimation();
  }, [isVisible]);

  const translateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] });
  const scale = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

  return (
    <View style={styles.container}>
      {/* Layer 1: Base Gradient */}
      <LinearGradient colors={baseGradient} style={StyleSheet.absoluteFillObject} />

      {/* Layer 2: Dynamic Background — only render when visible */}
      {isVisible && (
        <>
          {bgType === 'lottie' && <LottieBackground />}
          {bgType === 'image' && <ImageBackground concept={atom.concept} />}
          {bgType === 'blob' && <BlobBackground />}
        </>
      )}

      {/* Layer 3: Generative SVG Art Overlay — only render when visible */}
      {isVisible && (
        <View style={styles.artOverlay}>
          <GenerativeArt concept={atom.concept} />
        </View>
      )}

      {/* Layer 4: Glassmorphism Content Card */}
      <Animated.View style={[styles.cardGlass, { opacity: cardAnim, transform: [{ translateY }, { scale }] }]}>
        <BlurView intensity={30} tint="default" style={styles.blurContainer}>
          
          <View style={styles.header}>
            <View style={styles.counter}>
              <Text style={styles.counterCurrent}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.counterSep}>/</Text>
              <Text style={styles.counterTotal}>{String(total).padStart(2, '0')}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{typeLabels[atom.atom_type] || 'Concept'}</Text>
            </View>
          </View>

          <Text style={styles.conceptTitle}>{atom.concept}</Text>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <TypeCard atom={atom} />
            <View style={{ height: 20 }} />
          </ScrollView>

        </BlurView>
      </Animated.View>

    </View>
  );
});

export default AtomCard;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80, // Offset for the absolute header in TopicViewScreen
  },
  artOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardGlass: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  blurContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  counterCurrent: {
    fontSize: 20,
    color: '#00d1ff',
    fontFamily: 'Outfit_700Bold',
  },
  counterSep: {
    fontSize: 16,
    color: '#747879',
    marginHorizontal: 4,
    fontFamily: 'Outfit_700Bold',
  },
  counterTotal: {
    fontSize: 16,
    color: '#747879',
    fontFamily: 'Outfit_700Bold',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 209, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 209, 255, 0.3)',
  },
  typeText: {
    color: '#00d1ff',
    fontSize: 12,
    fontFamily: 'Quicksand_700Bold',
  },
  conceptTitle: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentScroll: {
    maxHeight: height * 0.42,
  }
});
