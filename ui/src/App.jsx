import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testApi = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Use a relative path. Firebase Hosting will rewrite this to your function.
      console.log('Fetching /hello endpoint...');
      const response = await fetch('/api/hello');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Response received, parsing JSON...');
      console.log('Response status:', response);
      const data = await response.json();
      console.log({ data });

      setMessage(data.message);
    } catch (e) {
      setError(`Failed to fetch: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>URL Shortener</h1>
      <div className='card'>
        <button onClick={testApi} disabled={loading}>
          {loading ? 'Loading...' : 'Test API Connection'}
        </button>
        {message && <p style={{ color: 'green' }}>Success: {message}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </>
  );
}

export default App;
