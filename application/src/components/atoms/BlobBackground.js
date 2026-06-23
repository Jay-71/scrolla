import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function BlobBackground() {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(moveAnim, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY1 = moveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });
  const translateY2 = moveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -150] });

  return (
    <Animated.View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.blob1, { transform: [{ translateY: translateY1 }, { scale: 1.2 }] }]} />
      <Animated.View style={[styles.blob2, { transform: [{ translateY: translateY2 }, { scale: 1.5 }] }]} />
      <LinearGradient colors={['rgba(10,10,20,0.4)', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob1: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(157, 114, 255, 0.4)',
    opacity: 0.6,
  },
  blob2: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: 'rgba(0, 245, 255, 0.3)',
    opacity: 0.5,
  }
});
