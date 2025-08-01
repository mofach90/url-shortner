import { Button } from '@mui/material';
import useAuthStore from '../store/authStore.js';

export default function AuthButton() {
  const { user, login, logout, loading } = useAuthStore();

  if (loading) return <span>Loading…</span>;

  if (!user) {
    return (
      <Button onClick={login} variant='outlined' color='primary'>
        Sign in with Google
      </Button>
    );
  }
  return (
    <Button onClick={logout} variant='outlined' color='primary'>
      Sign out ({user.displayName?.split(' ')[0] ?? 'user'})
    </Button>
  );
}
