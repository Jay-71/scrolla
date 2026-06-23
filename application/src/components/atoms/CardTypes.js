import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ExplanationCard({ atom }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{atom.content}</Text>
    </View>
  );
}

export function MentalModelCard({ atom }) {
  return (
    <View style={styles.container}>
      <View style={styles.modelBox}>
        <Text style={styles.modelTitle}>💡 Mental Model</Text>
        <Text style={styles.modelText}>{atom.content}</Text>
      </View>
    </View>
  );
}

export function KeyPointsCard({ atom }) {
  // Try to split key points if they are numbered
  const points = typeof atom.content === 'string' ? atom.content.split(/\d+\.\s+/).filter(Boolean) : [];

  return (
    <View style={styles.container}>
      <View style={styles.pointsBox}>
        {points.length > 0 ? points.map((pt, i) => (
          <Text key={i} style={styles.pointText}>• {pt.trim()}</Text>
        )) : (
          <Text style={styles.text}>{atom.content}</Text>
        )}
      </View>
    </View>
  );
}

export function QuickCheckCard({ atom }) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{atom.content}</Text>
    </View>
  );
}

// Fallback card
export function DefaultCard({ atom }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{atom.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  text: { fontSize: 18, color: '#e2e0fc', lineHeight: 28, fontFamily: 'Quicksand_400Regular' },
  modelBox: { padding: 20, backgroundColor: 'rgba(255, 215, 64, 0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 215, 64, 0.3)' },
  modelTitle: { fontSize: 16, color: '#FFD740', fontFamily: 'Quicksand_700Bold', marginBottom: 12 },
  modelText: { fontSize: 18, color: '#fff', fontStyle: 'italic', lineHeight: 28, fontFamily: 'Quicksand_400Regular' },
  pointsBox: { gap: 12 },
  pointText: { fontSize: 18, color: '#c6c4d8', lineHeight: 26, fontFamily: 'Quicksand_400Regular', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  questionText: { fontSize: 22, color: '#00d1ff', fontFamily: 'Outfit_700Bold', lineHeight: 32, textAlign: 'center', marginVertical: 20 },
});
