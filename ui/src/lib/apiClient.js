import { auth } from './firebase';

export async function fetchWithAuth(path, options = {}) {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(path, { ...options, headers });
}
