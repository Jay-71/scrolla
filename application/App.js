import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Quicksand_400Regular, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import RoadmapScreen from './src/screens/learning/RoadmapScreen';
import TopicViewScreen from './src/screens/learning/TopicViewScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
    Quicksand_400Regular,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Return null or a splash screen while loading
  }

  return (
    <NavigationContainer>
      {/* Set status bar style to match the current screen's theme, default to auto */}
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // We use custom headers in each screen
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Smooth horizontal transitions
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Roadmap" component={RoadmapScreen} />
        <Stack.Screen name="TopicView" component={TopicViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
