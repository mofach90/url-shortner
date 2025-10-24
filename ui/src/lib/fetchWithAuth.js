import useAuthStore from '../store/authStore.js';

export async function fetchWithAuth(url, options = {}) {
  const { idToken } = useAuthStore.getState();

  if (!idToken) {
    throw new Error('User not authenticated');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
    ...(options.headers || {}),
  };

  // Merge options safely
  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Try to parse JSON if possible
  const isJson = response.headers
    ?.get('content-type')
    ?.includes('application/json');

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      (data && data.error) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:5001/mo-url-shortner/us-central1/api';
