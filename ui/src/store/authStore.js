import { signInWithPopup, signOut } from 'firebase/auth';
import { create } from 'zustand';
import { auth, googleProvider } from '../lib/firebase.js';

const useAuthStore = create((set) => ({
  user: null,
  idToken: null,
  loading: true,
  error: null,
  login: async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      set({
        user: cred.user,
        idToken: await cred.user.getIdToken(),
        loading: false,
      });
    } catch (error) {
      console.error('Login failed', error);
      set({
        user: null,
        idToken: null,
        loading: false,
        error: error.message,
      });
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({
        user: null,
        idToken: null,
      });
    } catch (error) {
      console.error('Logout failed', error);
      set({
        error: error.message,
      });
    }
  },
}));

export default useAuthStore;
