import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

const LoginScreen = () => {
  const { signIn, loading, error } = useGoogleAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <MaterialIcons name="arrow-back" size={24} color="#181f21" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCROLLA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"The beautiful thing about learning is that no one can take it away from you."</Text>
          <View style={styles.quoteDivider} />
        </View>

        {/* Steel Container */}
        <View style={styles.steelContainer}>
          {/* Corner Accents */}
          <View style={[styles.cornerAccent, styles.topLeftAccent]} />
          <View style={[styles.cornerAccent, styles.topRightAccent]} />
          <View style={[styles.cornerAccent, styles.bottomLeftAccent]} />
          <View style={[styles.cornerAccent, styles.bottomRightAccent]} />

          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.logoSubtext}>PRECISION LEARNING ENGINE</Text>
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue your precision learning journey.</Text>
          </View>

          {/* Social Login Button */}
          <TouchableOpacity 
            style={styles.steelButton} 
            onPress={signIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#181f21" />
            ) : (
              <>
                <GoogleIcon />
                <Text style={styles.buttonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign Up Link */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={styles.footerLink}
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.bottomFooter}>
          <Text style={styles.bottomFooterText}>© 2026 Scrolla AI Learning. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf9f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    borderBottomWidth: 2,
    borderBottomColor: '#181f21',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    letterSpacing: 2,
    color: '#181f21',
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: 'center',
  },
  quoteContainer: {
    marginBottom: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quoteText: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 24,
    color: '#181f21',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 32,
  },
  quoteDivider: {
    height: 4,
    width: 64,
    backgroundColor: '#181f21',
    marginTop: 24,
  },
  steelContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#181f21',
    padding: 32,
    position: 'relative',
    elevation: 0,
  },
  cornerAccent: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: '#181f21',
  },
  topLeftAccent: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRightAccent: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeftAccent: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRightAccent: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 128,
    height: 128,
    borderWidth: 2,
    borderColor: '#181f21',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#181f21',
  },
  logoSubtext: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 10,
    letterSpacing: 3,
    color: '#181f21',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 32,
    color: '#181f21',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    color: '#434749',
    textAlign: 'center',
  },
  steelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#181f21',
    backgroundColor: 'transparent',
    marginTop: 32,
  },
  buttonText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 16,
    color: '#181f21',
    marginLeft: 12,
  },
  errorText: {
    color: '#ba1a1a',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  footerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    color: '#434749',
  },
  footerLink: {
    color: '#181f21',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  bottomFooter: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  bottomFooterText: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    color: '#434749',
  }
});

export default LoginScreen;
