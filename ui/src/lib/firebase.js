import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters(
    
    // { prompt: 'select_account' } // Uncomment this line if you want to always prompt the user to select an account

);
console.log("🔥 FIREBASE PROJECT:", window.location.hostname);
if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
  // Connect to the local Auth emulator
  import("firebase/auth").then(({ connectAuthEmulator }) => {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    console.log("⚙️ Auth emulator connected");
  });
}

export { app, auth, googleProvider };
