# Scrolla Mobile Application (Expo Client)

This folder contains the complete React Native Expo codebase for the Scrolla mobile learning client. It is engineered with offline-first persistence, edge-cached CDN fetches, and extreme visual aesthetics leveraging the Stitch MCP Design System.

---

## 🏗️ Architecture & Core Philosophy

### 1. State-Driven Protected Navigation
The application uses a strict State-Driven routing mechanism via `firebase/auth`. 
- `App.js` maintains an active `onAuthStateChanged` listener. 
- If no user is authenticated, the app completely blocks the main stack and isolates the user to the `Login` and `SignUp` screens.
- **Never manually force-navigate away from the Login Screen**. When a user logs in, the Firebase hook automatically trips the state, instantly routing them to the Home Feed.

### 2. Network Strategy: Offline-First SWR
The app uses a custom hook: `src/hooks/useTopicSWR.js`.
- It fetches the heavy JSON learning curriculums from our Vercel Edge CDN.
- **Immediate Feedback**: It uses `AsyncStorage` to serve cached modules locally with 0ms latency.
- **Background Validation**: It silently triggers a background network request (Stale-While-Revalidate). If the CDN has newer content, it downloads it and updates the memory state seamlessly.

### 3. Generative UI & Design System
We utilize designs fetched straight from the **Stitch Design System** (specifically the "Steel" and "Vibrant" glassmorphism aesthetics).
- **Images**: Use `expo-image` (`<Image cachePolicy="memory-disk" />`) instead of standard React Native images. We use a deterministic hashing algorithm (`generateSeed` in `ImageBackground.js`) to ensure images stay consistent without requiring us to host them.
- **Lotties**: Only use Lottie JSON files verified to be under 400kb to prevent thread locking.
- **BlurViews**: On Android, `expo-blur` has severe bugs that swallow touch events. **Rule of Thumb:** If you need a clickable button inside a navbar, do not wrap it in a `BlurView` on Android.

---

## 🛠️ Developer Setup & Secrets

### 1. The Environment File (`.env`)
To run this application locally, you **MUST** configure a `.env` file at the root of the `application/` folder. This links the Google Login gateway to Firebase.

```text
# application/.env
EXPO_PUBLIC_WEB_CLIENT_ID=your_firebase_web_client_id_here
```
> **CRITICAL**: The `EXPO_PUBLIC_WEB_CLIENT_ID` must be the **Web Client ID** (Auto-generated Server Client ID) found in your Firebase Authentication settings, *not* the Android Client ID. Supplying the wrong ID will trigger a `DEVELOPER_ERROR` during login.

### 2. Native Android Build Requirements
Because we use native Firebase plugins (`@react-native-google-signin/google-signin`), standard "Expo Go" will not work. You must compile a Custom Development Client.

You are required to place the `google-services.json` file inside the `application/` directory.

Whenever you alter the package name (`com.jay.scrolla`) or update the `google-services.json`, you **must** wipe the native directory and rebuild:
```bash
npx expo prebuild --clean
```

---

## 🚀 Running the App

1. Ensure your `.env` and `google-services.json` are properly placed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the emulator via Android Studio.
4. Start the Custom Expo Development Client:
   ```bash
   npx expo start --dev-client
   ```
5. Press `a` in the terminal to launch on the Android emulator.

---

## 🛡️ Security & Performance Standards

If you are contributing code to this repository, you must adhere to the following strict guidelines:
- **No Console Logging**: Do not push raw `console.log` or `console.error` functions that dump payload structures or SWR API errors. Android `logcat` dumps these directly to the device log buffer. Wrap all internal logging in `if (__DEV__)` flags.
- **Static Resolution**: Heavy packages like `AsyncStorage` must be imported at the top of the file statically. Do not execute dynamic `require()` statements inside `onPress` callbacks, as the Metro Bundler cannot pre-allocate them, leading to jittery screen transitions.
- **Safe Area Insets**: React Native's standard `<SafeAreaView>` has no effect on Android. When designing custom headers, you must manually inject `paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0` to prevent UI elements from sliding underneath the physical device notch.
