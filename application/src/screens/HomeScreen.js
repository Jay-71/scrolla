import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon} />
            <Text style={styles.logoText}>SCROLLA</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-outline" size={20} color="#121515" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Absolute Precision.</Text>
          <Text style={styles.heroSubtitle}>Learn Machine Learning without the noise.</Text>
          
          <TouchableOpacity 
            style={styles.ctaButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Roadmap')}
          >
            <Text style={styles.ctaText}>EXPLORE ROADMAP</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{marginLeft: 8}}/>
          </TouchableOpacity>
        </View>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Card 1 */}
          <View style={[styles.bentoCard, styles.bentoFull]}>
            <Ionicons name="terminal-outline" size={24} color="#121515" style={{marginBottom: 12}} />
            <Text style={styles.cardTitle}>Semantic Engine</Text>
            <Text style={styles.cardDesc}>
              The core processor breaks down vast information matrices into logical, atomic data structures. No fluff, just the critical path to understanding.
            </Text>
          </View>
          
          {/* Row */}
          <View style={styles.bentoRow}>
            {/* Card 2 */}
            <View style={[styles.bentoCard, styles.bentoHalf]}>
              <Ionicons name="shield-outline" size={24} color="#121515" style={{marginBottom: 12}} />
              <Text style={styles.cardTitle}>Impenetrable</Text>
              <Text style={styles.cardDesc}>
                Fortified logic structures ensure knowledge retention.
              </Text>
            </View>
            
            {/* Card 3 */}
            <View style={[styles.bentoCard, styles.bentoHalf]}>
              <Ionicons name="git-network-outline" size={24} color="#121515" style={{marginBottom: 12}} />
              <Text style={styles.cardTitle}>Neural Mesh</Text>
              <Text style={styles.cardDesc}>
                Concepts interlink dynamically, constructing a robust lattice.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5ebe0',
  },
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#121515',
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121515',
    letterSpacing: 2,
  },
  profileBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#575c56',
    borderRadius: 20,
  },
  hero: {
    marginBottom: 60,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#121515',
    lineHeight: 52,
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#575c56',
    lineHeight: 26,
    marginBottom: 32,
    maxWidth: '80%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121515',
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    // Metallic elevation effect
    shadowColor: '#121515',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  bentoGrid: {
    gap: 16,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoCard: {
    backgroundColor: '#fcf8f8',
    borderWidth: 1,
    borderColor: '#121515',
    padding: 24,
    justifyContent: 'space-between',
  },
  bentoFull: {
    width: '100%',
  },
  bentoHalf: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#121515',
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 14,
    color: '#575c56',
    lineHeight: 20,
  },
});
