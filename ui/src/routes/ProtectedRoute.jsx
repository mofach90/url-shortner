import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

export default function ProtectedRoute({ element }) {
  const { user, loading } = useAuthStore();
  useEffect(() => {
    const uid = user?.uid;
    if (uid && !loading) {
      console.log('ProtectedRoute: user is signed in', { uid });
    } else {
      console.log('ProtectedRoute: user is NOT signed in');
    }
  }, [loading, user]);

  if (loading) return null; // or a spinner
  if (!user) return <Navigate to='/' replace />;

  return element; // user is signed in
}
