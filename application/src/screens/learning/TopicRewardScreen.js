import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, InteractionManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Exact colors from the Stitch Light Theme (bg-organic-glow / charcoal-glow)
const colors = {
  background: '#fcf9f8',
  primary: '#181f21',
  secondary: '#4f6359',
  onSecondary: '#ffffff',
  onSurfaceVariant: '#434749',
  surfaceContainer: '#cfe5d9', // Secondary container for the icon box
  onSecondaryContainer: '#54675e',
};

export default function TopicRewardScreen({ route, navigation }) {
  const { title = "Topic", atomCount = 0 } = route.params || {};

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Confetti / Particles (Pool of 30 for continuous recycling - Optimized)
  const particles = useRef(Array(30).fill(0).map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
    scale: Math.random() * 0.8 + 0.4,
    color: ['#0ea5e9', '#8b5cf6', '#d946ef', '#f59e0b'][Math.floor(Math.random() * 4)],
    isAnimating: false
  }))).current;

  useEffect(() => {
    let intervalId;
    let interactionTask;

    // Run simple entrance animations immediately
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true })
    ]).start();

    // Defer heavy loops and JS intervals until AFTER the screen transition finishes
    interactionTask = InteractionManager.runAfterInteractions(() => {
      // Orb Pulse Loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
        ])
      ).start();

      // Continuous Sine-Wave Confetti Explosion
      let time = 0;
      intervalId = setInterval(() => {
        time += 0.1;
        const wave = (Math.sin(time) + 1) / 2;
        const particlesToFire = Math.floor(wave * 3);
        
        let fired = 0;
        for (let i = 0; i < particles.length; i++) {
          if (!particles[i].isAnimating) {
            const p = particles[i];
            p.isAnimating = true;
            
            const startX = width / 2 + (Math.random() * 100 - 50);
            const startY = height;
            p.x.setValue(startX);
            p.y.setValue(startY);
            
            Animated.sequence([
              Animated.parallel([
                Animated.timing(p.opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.timing(p.x, { 
                  toValue: startX + (Math.random() * 600 - 300), 
                  duration: 2500 + Math.random() * 1000, 
                  useNativeDriver: true 
                }),
                Animated.timing(p.y, { 
                  toValue: height * 0.2 + (Math.random() * 200), 
                  duration: 2500 + Math.random() * 1000, 
                  useNativeDriver: true 
                })
              ]),
              Animated.timing(p.opacity, { toValue: 0, duration: 400, useNativeDriver: true })
            ]).start(() => {
              p.isAnimating = false;
            });
            
            fired++;
            if (fired >= particlesToFire) break;
          }
        }
      }, 100);
    });

    return () => {
      if (interactionTask) interactionTask.cancel();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Light Theme Radial Gradients */}
      <View style={[styles.glowBlob, { top: height * 0.1, left: -50, backgroundColor: 'rgba(13, 148, 136, 0.15)' }]} />
      <View style={[styles.glowBlob, { top: height * 0.5, right: -100, backgroundColor: 'rgba(139, 92, 246, 0.15)' }]} />
      <View style={[styles.glowBlob, { bottom: -50, left: width * 0.2, backgroundColor: 'rgba(245, 158, 11, 0.1)' }]} />

      <Animated.View style={[styles.content, { 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }] 
        }]}
      >
        {/* 100% Glowing Orb */}
        <Animated.View style={[styles.orbShadow, { transform: [{ scale: pulseAnim }] }]}>
          <BlurView experimentalBlurMethod="dimezisBlurView" intensity={40} tint="light" style={styles.orbWrapper}>
            {/* Subtle inner gradient proxy */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(79,99,89,0.1)' }]} />
            <Ionicons name="ribbon" size={64} color={colors.secondary} />
            <Text style={styles.orbText}>100%</Text>
          </BlurView>
        </Animated.View>

        {/* Headlines */}
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>You've mastered this topic.</Text>

        {/* Summary Card */}
        <View style={styles.summaryShadow}>
          <BlurView experimentalBlurMethod="dimezisBlurView" intensity={50} tint="light" style={styles.summaryCardWrapper}>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconBox}>
                <Ionicons name="flask" size={24} color={colors.onSecondaryContainer} />
              </View>
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>Completion</Text>
                <Text style={styles.summaryValue}>{atomCount} Atoms Learned</Text>
                <Text style={styles.summaryTopic} numberOfLines={1}>{title}</Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => {
            // Pop the top 2 screens (TopicReward and TopicView) to smoothly reveal the Roadmap below
            navigation.pop(2);
          }}
        >
          <Text style={styles.buttonText}>Return to Roadmap</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Confetti Particles (Rendered ON TOP of BlurViews to prevent extreme lag on Android) */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {particles.map((p, i) => (
          <Animated.View 
            key={i} 
            renderToHardwareTextureAndroid={true}
            style={[styles.particle, { 
              backgroundColor: p.color,
              transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
              opacity: p.opacity 
            }]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  glowBlob: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    filter: 'blur(40px)', // Exponent Blur
    opacity: 0.8,
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, zIndex: 10 },
  
  orbShadow: {
    marginBottom: 40,
    shadowColor: 'rgba(74, 93, 84, 0.8)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
    backgroundColor: 'transparent',
    borderRadius: 96,
  },
  orbWrapper: {
    width: 192,
    height: 192,
    borderRadius: 96,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: colors.primary,
    marginTop: 8,
  },

  title: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 32,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 18,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 40,
  },

  summaryShadow: {
    width: '100%',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
    backgroundColor: 'transparent',
    borderRadius: 24,
  },
  summaryCardWrapper: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryTextCol: { flex: 1 },
  summaryLabel: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.primary,
  },
  summaryTopic: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },

  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: 'rgba(79,99,89,0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 18,
    color: colors.onSecondary,
  }
});
