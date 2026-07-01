import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';

export default function ImageBackground({ concept }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Generate a consistent pseudo-random image per concept
  const generateSeed = (str) => {
    if (!str) return 99999;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };
  const seed = generateSeed(concept);
  const imageUrl = `https://picsum.photos/seed/${seed}/800/1200`;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    return () => fadeAnim.stopAnimation();
  }, [concept]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
      <Image 
        source={imageUrl} 
        style={StyleSheet.absoluteFillObject} 
        contentFit="cover"
        blurRadius={4}
        cachePolicy="memory-disk"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
    </Animated.View>
  );
}
