// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

/**
 * Hook customizado para fazer chamadas de API.
 */
export const useFetch = (apiServiceCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiServiceCall();
        setData(result);
      } catch (err) {
        setError(err.message || 'Ocorreu um erro');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); // O array de dependências permite chamar o fetch dnv se algo mudar

  return { data, loading, error };
};