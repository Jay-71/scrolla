import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
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

const SignUpScreen = () => {
  const { signIn, loading, error } = useGoogleAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1b1b1c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCROLLA</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.main}>
        <View style={styles.steelContainer}>
          {/* Accent Corners */}
          <View style={[styles.cornerAccent, styles.topLeftAccent]} />
          <View style={[styles.cornerAccent, styles.topRightAccent]} />
          <View style={[styles.cornerAccent, styles.bottomLeftAccent]} />
          <View style={[styles.cornerAccent, styles.bottomRightAccent]} />

          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>CREATE ACCOUNT</Text>
            <Text style={styles.subtitle}>Start your journey into Machine Learning precision.</Text>
          </View>

          <TouchableOpacity 
            style={styles.steelButton} 
            onPress={signIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1b1b1c" />
            ) : (
              <>
                <GoogleIcon />
                <Text style={styles.buttonText}>SIGN UP WITH GOOGLE</Text>
              </>
            )}
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.footerContainer}>
          <Text 
            style={styles.footerLink}
            onPress={() => navigation.navigate('Login')}
          >
            Already have an account? Log In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    borderBottomWidth: 2,
    borderBottomColor: '#181f21',
    backgroundColor: '#ffffff',
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
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  steelContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1b1b1c',
    padding: 32,
    position: 'relative',
    marginBottom: 32,
  },
  cornerAccent: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#181f21',
  },
  topLeftAccent: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRightAccent: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeftAccent: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRightAccent: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 32,
    color: '#181f21',
    marginBottom: 8,
    textAlign: 'center',
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
    borderColor: '#1b1b1c',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 18,
    color: '#1b1b1c',
    marginLeft: 12,
    letterSpacing: 1,
  },
  errorText: {
    color: '#ba1a1a',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerLink: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    color: '#434749',
    textDecorationLine: 'underline',
  }
});

export default SignUpScreen;
