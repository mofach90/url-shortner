import { API_BASE_URL, fetchWithAuth } from './fetchWithAuth.js';

export async function createShortUrl(longUrl, customCode) {
  const body = customCode ? { longUrl, customCode } : { longUrl };

  return await fetchWithAuth(`${API_BASE_URL}/shorten`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteLink(code) {
  const data = await fetchWithAuth(`${API_BASE_URL}/links/${code}`, {
    method: 'DELETE',
  });
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete link');
  }

  return data;
}

export async function updateLink(code, newLongUrl) {
  const data = await fetchWithAuth(`${API_BASE_URL}/links/${code}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ longUrl: newLongUrl }),
  });

  if (data.error) {
    throw new Error(data.error || 'Failed to update link');
  }

  return data;
}

export async function fetchAnalyticsSummary() {
  const data = await fetchWithAuth(`${API_BASE_URL}/analytics/summary`);
  return data;
}


export async function checkCodeAvailability(code) {
  const res = await fetch(`${API_BASE_URL}/check-code/${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error("Failed to check availability");
  return res.json(); // { available: true/false }
}
