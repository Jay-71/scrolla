import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace the following with your app's Firebase project configuration
// You can find these details in your Firebase console under Project Settings
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

console.log("Firebase Init Config:", firebaseConfig);

// Handle Expo Fast Refresh cleanly
let app, auth, db;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  // Initialize Cloud Firestore using default Memory Cache
  // Note: The Web SDK's persistentLocalCache requires IndexedDB which is unavailable in React Native.
  db = initializeFirestore(app, {}, 'default');
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app, 'default');
}

export { app, auth, db };
