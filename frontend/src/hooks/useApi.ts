import { useState, useCallback } from 'react';
import api from '../services/api';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (url: string, method = 'GET', body?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = method === 'GET' ? await api.get(url) : method === 'POST' ? await api.post(url, body) : method === 'PATCH' ? await api.patch(url, body) : await api.delete(url);
      setData(response.data.data);
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute, setData };
}
