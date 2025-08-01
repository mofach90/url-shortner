import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase.js';
import useAuthStore from './store/authStore.js';

const set = useAuthStore.setState; 

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const idToken = await firebaseUser.getIdToken();
    set({ user: firebaseUser, idToken, loading: false });
  } else {
    set({ user: null, idToken: null, loading: false });
  }
});