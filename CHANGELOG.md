# Scrolla App - Sequential Update Log

This document tracks the major updates, architectural changes, and performance optimizations implemented in the Scrolla application.

## Phase 1: Data Architecture & Curriculum Synchronization
- **Curriculum Audit**: Audited and fixed 70+ JSON curriculum files across Machine Learning and Data Science topics using an automated Python pipeline. Standardized atom counts, fixed character limits, and improved content clarity.
- **Roadmap Synchronization**: Automated the alignment of `roadmap_modules.json` with the Vercel CDN `index.json` to resolve ID mismatches and ensure smooth client-side fetching.

## Phase 2: Navigation & Reward System
- **Reward Screen Implementation**: Built the `TopicRewardScreen.js` leveraging the Stitch MCP design system, utilizing a premium light-theme glassmorphism aesthetic.
- **Navigation Flow**: Connected the "Complete Topic" button in `TopicViewScreen.js` to seamlessly transition to the new Reward Screen.

## Phase 3: Android Rendering & UI Bug Fixes
- **White Box Bug Resolved**: Fixed a critical Android rendering bug where `BlurView` components combined with shadows caused solid white rectangles. Solved by decoupling shadow wrappers from the clipped inner glass containers.
- **BlurView Fallback Fix**: Migrated from standard fallback blurring to the modern `experimentalBlurMethod="dimezisBlurView"` on Android to ensure true native frosted glass.

## Phase 4: Animation & Performance Optimization
- **Continuous Confetti**: Replaced the static confetti burst on the Reward Screen with a continuous, looping Sine-Wave particle generator.
- **Object Pooling**: Optimized confetti memory footprint by using a recycled object pool of 30 `Animated.View` particles.
- **Z-Index Blur Optimization**: Moved Confetti particles to render *in front* of BlurViews, preventing Android from recalculating the heavy blur filter 60 times a second, resolving massive frame drops.
- **Transition Lag Fix**: Wrapped heavy animation loops and the confetti generator inside `InteractionManager.runAfterInteractions` to guarantee a silky-smooth React Navigation screen transition.

## Phase 5: Aesthetic Polish & Immersive Design
- **Infinite Dark Theme Generator**: Removed the static dark purple background in `AtomCard.js`. Built a mathematical HSL color generator utilizing the Golden Ratio (137.5 degrees) to dynamically create 100+ unique, vibrant, dark-themed background gradients for every single atom.
- **Lottie Background Softening**: Subdued the chaotic Lottie animations behind the text by overlaying a highly-performant semi-transparent dark view (`rgba(6, 6, 9, 0.75)`), replacing an expensive `BlurView` while returning the Lottie engine to `HARDWARE` acceleration.
- **Natural Glassmorphism Shadows**: Drastically reduced harsh Android `elevation` properties (from 15 to 2) and lowered `shadowOpacity` across the Reward Screen to create softer, wider, and more premium-looking shadows.

## Phase 6: Image Handling Improvements (Recent)
- **Expo Image Migration**: Migrated `ImageBackground.js` to use the highly optimized `expo-image` library (`contentFit="cover"`, `cachePolicy="memory-disk"`).
- **Deterministic Hashing**: Implemented a robust string hashing algorithm (`generateSeed`) to guarantee consistent, high-quality pseudo-random images for each atom concept.

## Phase 7: Firebase & Google Authentication Integration
- **SDK Integrations**: Installed and configured the Firebase SDK and `@react-native-google-signin/google-signin` native plugin in `app.json`.
- **Firebase Initialization**: Built `firebaseConfig.js` utility using `@react-native-async-storage/async-storage` to ensure reliable session persistence across app reloads.
- **Secure Environment Setup**: Added a `.env` architecture using `EXPO_PUBLIC_` variables to protect API keys and the Web Client ID, ensuring secrets are excluded from Git.
- **Google Auth Hook**: Created a robust `useGoogleAuth.js` custom hook that handles the complete Google Sign-in OAuth flow, handles specific Play Services errors, and links the resulting Google credential directly to Firebase Auth.
- **Login Gateway**: Developed `LoginScreen.js` and a reusable `GoogleSignInButton` component. 
- **Protected Routing**: Refactored `App.js` to utilize Firebase's real-time `onAuthStateChanged` listener. The app navigation is now entirely state-driven, actively blocking access to all internal screens (Home, Roadmap, Profile) until a valid user is successfully authenticated.
- **Native Android Configuration & Build Pipeline**: 
  - Updated the application package name to `com.jay.scrolla` in `app.json` to resolve global SHA-1 / package name collisions in Google Cloud.
  - Linked the native `google-services.json` securely into the Expo Android build pipeline.
  - Rectified Google Play Services `DEVELOPER_ERROR` crashes by enforcing the use of the correct Web Client ID over the Android Client ID in `.env`.
  - Executed `npx expo prebuild --clean` to force regeneration of the native Android directory, successfully compiling a custom Expo development client.

## Phase 8: UI Overhaul & Dynamic Profile Integration
- **Stitch MCP UI Integration**: Fetched the exact HTML/CSS designs for the "Steel Aesthetic" directly from the Stitch MCP and manually converted them into pixel-perfect React Native components.
- **New Authentication Flow**: Replaced the placeholder Login screen with the premium "Steel Login" screen, and added a brand new "Steel Sign-Up" screen, complete with seamless state-driven navigation between the two.
- **Firebase Profile Integration**: Connected `ProfileScreen.js` to the live `auth.currentUser` session object.
- **Dynamic Avatar Rendering**: Implemented the highly optimized `expo-image` component to render the user's live Google profile picture (`photoURL`) onto the profile card, falling back to an initial if no picture exists.
- **Live User Data**: Bound the `displayName` and `email` directly to the Profile card UI.
- **Secure Log Out**: Actively wired up the "Log Out" button to Firebase's `signOut()` method, enabling instant, secure unauthentication and automatic routing back to the Login gateway.
- **Responsive Layout Fixes**: Wrapped the Login screen content inside a `ScrollView` with safe padding to prevent typography elements from bleeding into the Top App Bar on smaller mobile devices.

## Phase 9: Security & Performance Optimization
- **Data Leak Prevention**: Conducted a codebase-wide audit of internal logging. Wrapped all `console.log` and `console.error` outputs (in `LottieBackground.js`, `RoadmapScreen.js`, `TopicViewScreen.js`, and `useTopicSWR.js`) inside strict `if (__DEV__)` condition blocks to ensure sensitive network routes, caching states, and payload structures are aggressively stripped from the Metro Bundler's production binary and not leaked to the Android Logcat.
- **Dynamic Require Bottleneck Fix**: Eliminated a severe performance bottleneck in `TopicViewScreen.js` where `AsyncStorage` was dynamically required exactly on the `onPress` execution thread of the "Complete Topic" button. Hoisted the import statically to the top of the module, ensuring upfront memory allocation by the Metro Bundler and guaranteeing a jitter-free, 60fps screen transition.
- **Android Touch Interception Fixed**: Resolved critical hitSlop and touch interception bugs. Safely removed `expo-blur` from `RoadmapScreen.js` to bypass a known Android touch bug, manually calculated exact `StatusBar` padding to prevent buttons from hiding under the system notch, and radically expanded touch target vectors.

## Phase 10: Alpha Testing UX Fixes
- **Lottie Animations**: Reduced playback speed by 70% and darkened the background overlay to keep the focus on the educational text rather than the erratic movement.
- **Roadmap Scrolling**: Implemented an auto-scrolling `scrollViewRef` mechanism. When a module is expanded, it automatically and smoothly scrolls to anchor itself at the top of the viewport.
- **Roadmap Accidental Collapsing**: Detached the module toggle `TouchableOpacity` from the entire card and restricted it exclusively to the top header area. Touching the expanded timeline box no longer collapses the module.
- **Atom Card Alignment**: Updated the `AtomCard` flex container. Instead of forcing a hard `height` based on screen dimensions (which ignores Android bottom navbars), it now uses `flex: 1` auto-centering with a dynamic `paddingTop` to properly balance beneath the navigation header.

## Phase 11: Path Selection Architecture & Blueprint Variant
- **New Screen Integration**: Translated the "Choose Your Path" brutalist UI design from the Stitch MCP into a native React Native component (`PathSelectionScreen.js`).
- **Dynamic Visual Styles**: Implemented a brutalist segment control toggle at the top of the screen to switch between two high-fidelity design variants on the fly:
  - **Standard**: Utilizes thick slate-gray borders (3px), deep drop shadows (6px), and a tactile interaction model where cards physically depress down and right when pressed. Inner cards feature a subtle gradient for depth.
  - **Blueprint**: Introduces a 2-column asymmetrical masonry layout (heights ranging from 160px to 220px) featuring highly technical labels and raw blueprint aesthetics.
- **Navigation Flow**: The "START LEARNING" button on the Home screen opens the Path Selection screen. Users can then select a specific discipline (Machine Learning, Frontend, Backend, MLOps) from either the Standard or Blueprint view to enter the Roadmap.

## Phase 12: Streak & Consistency Calendar Optimization
- **UI Integration**: Migrated the "Steel Minimal Strip" and "Steel Detailed Board" designs from Stitch MCP into React Native components (`MinimalStreakStrip.js`, `DetailedStreakBoard.js`).
- **Dynamic Calendar Matrix**: Built a dynamic 35-day activity matrix that visually tracks completed lesson days based on the user's local timezone.
- **Strict Activity Trigger**: Wired the streak calculation exclusively to the "Complete Topic" button in `TopicViewScreen.js`. Users only receive streak progression when they finish reading all atoms in a lesson.

### Firebase Architecture & Zero-Cost Strategy
Because Firebase Firestore charges per document *read* and *write*, a poorly designed streak calendar (where a user logs in and triggers a read every time, or saves a new document every single day) can cost thousands of dollars as the app scales. We implemented a **"Zero-Read Architecture"** to prevent this:

1. **Single-Document Storage Pattern**: 
   - Instead of saving a new document for every active day, we store all of a user's calendar history inside a single sub-collection map under their unique ID (`users -> [USER_ID]`). 
   - We store dates as keys (e.g., `"2023-10-25": ["topic_id"]`). This guarantees that fetching a user's entire historical calendar costs exactly **1 document read**, regardless of if they have a 5-day streak or a 5-year streak.

2. **Firestore Offline Persistence (0-Cost Profile Reads)**: 
   - Reconfigured `firebaseConfig.js` to utilize Firestore's `persistentLocalCache` via React Native's `AsyncStorage`.
   - When a user opens their Profile screen, the `getStreakData()` function intercepts the request and instantly pulls the data from the phone's physical storage cache rather than querying the cloud server. This reduces the server read cost for opening the profile to exactly **0**.

3. **Blind Write Architecture (0-Cost Updates)**: 
   - Eliminated the standard pre-computation read (checking the server to see what the old streak was before adding 1 to it).
   - `streakTracker.js` now executes streak logic purely using the local cache data via `getDocFromCache`. It calculates the new streak locally in JavaScript, and performs a "blind" `setDoc` to the server using `{ merge: true }`. 
   - This ensures that a user completing a topic costs exactly **1 write and 0 reads** on the backend.

### Firebase Console Setup & Security
- **Database Provisioning**: Initialized the Firestore Database in Production Mode, creating a custom database named `default`.
- **SDK Targeting**: Updated `firebaseConfig.js` to explicitly target `getFirestore(app, 'default')` to prevent the SDK from failing to find the default database ID `(default)`.
- **Security Rules (Data Isolation)**: Applied strict security rules in the Firebase Console to ensure users cannot spoof streaks or access other users' data. The rule `allow read, write: if request.auth != null && request.auth.uid == userId;` actively blocks any network request where the user's authentication token does not perfectly match the Document ID they are trying to edit.
