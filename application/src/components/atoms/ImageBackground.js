import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

export default function ImageBackground({ concept }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Generate a consistent pseudo-random image per concept
  const seed = concept ? concept.length * 12345 : 99999;
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
        source={{ uri: imageUrl }} 
        style={StyleSheet.absoluteFillObject} 
        resizeMode="cover"
        blurRadius={8}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
    </Animated.View>
  );
}
