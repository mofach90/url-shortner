import useAuthStore from '../store/authStore.js';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ element }) {
  const { user, loading } = useAuthStore();

  if (loading) return null; // or a spinner
  if (!user) return <Navigate to='/' replace />;

  return element; // user is signed in
}
