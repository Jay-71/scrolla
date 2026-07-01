import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Quicksand_400Regular, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase/firebaseConfig';

// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import PathSelectionScreen from './src/screens/PathSelectionScreen';
import RoadmapScreen from './src/screens/learning/RoadmapScreen';
import TopicViewScreen from './src/screens/learning/TopicViewScreen';
import TopicRewardScreen from './src/screens/learning/TopicRewardScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
    Quicksand_400Regular,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (!fontsLoaded || initializing) {
    return null; // Return null or a splash screen while loading
  }

  return (
    <NavigationContainer>
      {/* Set status bar style to match the current screen's theme, default to auto */}
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // We use custom headers in each screen
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Smooth horizontal transitions
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PathSelection" component={PathSelectionScreen} />
            <Stack.Screen name="Roadmap" component={RoadmapScreen} />
            <Stack.Screen name="TopicView" component={TopicViewScreen} />
            <Stack.Screen name="TopicReward" component={TopicRewardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
