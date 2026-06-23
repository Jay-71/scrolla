import React, { useMemo, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { G, Circle, Line } from 'react-native-svg';

const R = () => Math.random();
const RR = (min, max) => min + R() * (max - min);
const RI = (min, max) => Math.floor(RR(min, max));

const NEONS = [
  '#ff2d55', '#ff3b30', '#ff9500', '#ffcc00', '#4cd964',
  '#5ac8fa', '#007aff', '#5856d6', '#af52de', '#ff2d95',
  '#00e5ff', '#76ff03', '#ff6d00', '#d500f9', '#1de9b6',
  '#f50057', '#651fff', '#00b0ff', '#69f0ae', '#ffd740',
];
function neon() { return NEONS[RI(0, NEONS.length)]; }
function neonSet(n) { return Array.from({ length: n }, () => neon()); }

// --- Recipe 1: Constellation (static with opacity pulse) ---
function Constellation() {
  const colors = useMemo(() => neonSet(3), []);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const nodes = useMemo(() => Array.from({ length: RI(8, 14) }, (_, i) => ({
    x: RR(15, 185), y: RR(15, 185), r: RR(3, 7), color: colors[RI(0, 3)], idx: i
  })), []);

  const edges = useMemo(() => {
    const e = [];
    nodes.forEach((a, i) => nodes.forEach((b, j) => {
      if (j <= i) return;
      if (Math.hypot(a.x - b.x, a.y - b.y) < RR(60, 110)) {
        e.push({ a, b, color: colors[RI(0, 3)] });
      }
    }));
    return e;
  }, [nodes]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Use a single global opacity pulse instead of per-node animations
  // This is way cheaper on the native bridge
  const globalOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <G opacity={0.7}>
      {edges.map((e, i) => (
        <Line key={`e${i}`} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke={e.color} strokeWidth="1" opacity={0.4} />
      ))}
      {nodes.map((n, i) => (
        <Circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.7} />
      ))}
    </G>
  );
}

// --- Recipe 2: Particle Cloud (static scatter) ---
function ParticleCloud() {
  const colors = useMemo(() => neonSet(5), []);

  const particles = useMemo(() => Array.from({ length: RI(20, 35) }, (_, i) => ({
    x: RR(10, 190), y: RR(10, 190), r: RR(2, 6), color: colors[i % 5], idx: i
  })), []);

  return (
    <G opacity={0.6}>
      {particles.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={RR(0.3, 0.8)} />
      ))}
    </G>
  );
}

// --- Recipe 3: Orbits ---
function Orbits() {
  const colors = useMemo(() => neonSet(3), []);
  
  const orbits = useMemo(() => Array.from({ length: RI(3, 5) }, (_, i) => ({
    cx: 100, cy: 100, r: 30 + i * 25, color: colors[i % 3], idx: i
  })), []);

  const dots = useMemo(() => orbits.flatMap((orbit, oi) => 
    Array.from({ length: RI(2, 4) }, (_, di) => {
      const angle = RR(0, Math.PI * 2);
      return {
        x: orbit.cx + orbit.r * Math.cos(angle),
        y: orbit.cy + orbit.r * Math.sin(angle),
        r: RR(3, 6),
        color: orbit.color,
      };
    })
  ), [orbits]);

  return (
    <G opacity={0.5}>
      {orbits.map((o, i) => (
        <Circle key={`orbit${i}`} cx={o.cx} cy={o.cy} r={o.r} stroke={o.color} strokeWidth="0.8" fill="none" opacity={0.3} />
      ))}
      {dots.map((d, i) => (
        <Circle key={`dot${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={0.7} />
      ))}
    </G>
  );
}

const RECIPES = [Constellation, ParticleCloud, Orbits];

export default function GenerativeArt({ concept }) {
  const Recipe = useMemo(() => RECIPES[Math.floor(R() * RECIPES.length)], []);

  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 200">
      <Recipe />
    </Svg>
  );
}
