import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

export default function ProtectedRoute({ element }) {
  const { user, loading } = useAuthStore();
  useEffect(() => {
    console.log('ProtectedRoute: checking auth state', { user, loading });
  }, [loading, user]);

  if (loading) return null; // or a spinner
  if (!user) return <Navigate to='/' replace />;

  return element; // user is signed in
}
