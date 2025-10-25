import useAuthStore from '../store/authStore.js';
import { API_BASE_URL, fetchWithAuth } from './fetchWithAuth.js';

export async function createShortUrl(longUrl) {
  const { idToken } = useAuthStore.getState();

  const isLocal =
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost';

  const functionsEmuUrl = `http://127.0.0.1:5001/mo-url-shortner/us-central1/api/shorten`;

  const endpoint = isLocal ? functionsEmuUrl : `/api/shorten`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({ longUrl }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data?.error || `Request failed with ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function deleteLink(code) {
  const res = await fetchWithAuth(`${API_BASE_URL}/links/${code}`, {
    method: 'DELETE',
  });
  console.log("Delete link response:", res.success);
  if (!res.success) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete link');
  }
  return res.json();
}
