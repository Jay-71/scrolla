import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

/**
 * Verified Lottie URLs — all tested via cdn_audit.js on 2026-06-22.
 * Filtered to files under 400KB for mobile performance.
 * Full pool: 54 alive. Mobile-safe pool below: 40 URLs.
 */
const LOTTIE_URLS = [
  // ── Abstract & Geometric (8 original) ──
  "https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json",    // 200KB Tech
  "https://assets1.lottiefiles.com/packages/lf20_inti4oxf.json",     // 147KB Tech
  "https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json",    // 10KB  Particles
  "https://assets1.lottiefiles.com/packages/lf20_cwA7Cn.json",      // 131KB Particles
  "https://assets1.lottiefiles.com/packages/lf20_UJNc2t.json",      // 40KB  Abstract
  "https://assets1.lottiefiles.com/packages/lf20_bq485nmk.json",    // 21KB  Abstract
  "https://assets1.lottiefiles.com/packages/lf20_V9t630.json",      // 103KB Abstract
  "https://assets1.lottiefiles.com/packages/lf20_puciaact.json",    // 190KB Abstract

  // ── Newly verified from full registry ──
  "https://assets1.lottiefiles.com/packages/lf20_myejiggj.json",    // 96KB
  "https://assets1.lottiefiles.com/packages/lf20_svy4ivvy.json",    // 27KB
  "https://assets1.lottiefiles.com/packages/lf20_fcfjwiyb.json",    // 108KB
  "https://assets1.lottiefiles.com/packages/lf20_xlmz9xwm.json",   // 136KB
  "https://assets1.lottiefiles.com/packages/lf20_dn6rwtwl.json",    // 27KB
  "https://assets1.lottiefiles.com/packages/lf20_bniew9j6.json",    // 121KB
  "https://assets1.lottiefiles.com/packages/lf20_1pxqjqps.json",    // 58KB
  "https://assets1.lottiefiles.com/packages/lf20_zw0djhar.json",    // 135KB
  "https://assets1.lottiefiles.com/packages/lf20_hzwndued.json",    // 200KB
  "https://assets1.lottiefiles.com/packages/lf20_abqysclq.json",    // 60KB
  "https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json",    // 16KB
  "https://assets1.lottiefiles.com/packages/lf20_syqnfe7c.json",    // 123KB
  "https://assets1.lottiefiles.com/packages/lf20_v1yudlrx.json",    // 145KB
  "https://assets1.lottiefiles.com/packages/lf20_x62chJ.json",      // 8KB
  "https://assets1.lottiefiles.com/packages/lf20_GhkD0k.json",      // 107KB
  "https://assets1.lottiefiles.com/packages/lf20_4syck9ts.json",    // 381KB

  // ── Wave / Flow / Organic ──
  "https://assets1.lottiefiles.com/packages/lf20_jR229r.json",      // 59KB
  "https://assets1.lottiefiles.com/packages/lf20_kyu7xb1v.json",    // 282KB
  "https://assets1.lottiefiles.com/packages/lf20_u4jjb9bd.json",    // 288KB
  "https://assets1.lottiefiles.com/packages/lf20_vPnn3K.json",      // 99KB
  "https://assets1.lottiefiles.com/packages/lf20_jcikwtux.json",    // 145KB
  "https://assets1.lottiefiles.com/packages/lf20_w51pcehl.json",    // 82KB
  "https://assets1.lottiefiles.com/packages/lf20_UdIDHC.json",      // 41KB
  "https://assets1.lottiefiles.com/packages/lf20_p8bfn5to.json",    // 8KB
  "https://assets1.lottiefiles.com/packages/lf20_mbrocy0r.json",    // 266KB

  // ── Space / Stars / Cosmic ──
  "https://assets1.lottiefiles.com/packages/lf20_XZ3pkn.json",      // 4KB
  "https://assets1.lottiefiles.com/packages/lf20_xlkxtmul.json",    // 2KB
  "https://assets1.lottiefiles.com/packages/lf20_szlepvdh.json",    // 54KB
  "https://assets1.lottiefiles.com/packages/lf20_cbrbre30.json",    // 57KB

  // ── Liquid / Gradient / Morphing ──
  "https://assets1.lottiefiles.com/packages/lf20_rbtawnwz.json",    // 4KB
  "https://assets1.lottiefiles.com/packages/lf20_oyi9a28g.json",    // 223KB
  "https://assets1.lottiefiles.com/packages/lf20_xyadoh9h.json",    // 129KB
  "https://assets1.lottiefiles.com/packages/lf20_usmfx6bp.json",    // 33KB

  // ── GitHub Repos (lightweight) ──
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/adrock/data.json",   // 124KB
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gatin/data.json",    // 37KB
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/happy2016/data.json",// 307KB

  // ── V2 CDN ──
  "https://assets-v2.lottiefiles.com/a/50198a34-9c22-4b2d-a3ce-98d88bed82a8/pARybextv7.json", // 9KB
];

export default function LottieBackground() {
  const [url] = useState(() => LOTTIE_URLS[Math.floor(Math.random() * LOTTIE_URLS.length)]);
  const [animationData, setAnimationData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setAnimationData(data);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }
      })
      .catch(err => {
        if (!cancelled) console.log('Lottie load failed:', err.message);
      });

    return () => {
      cancelled = true;
      controller.abort();
      fadeAnim.stopAnimation();
    };
  }, []);

  if (!animationData) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, transform: [{ scale: 1.1 }] }]}>
      <LottieView
        ref={lottieRef}
        source={animationData}
        autoPlay
        loop
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
    </Animated.View>
  );
}
