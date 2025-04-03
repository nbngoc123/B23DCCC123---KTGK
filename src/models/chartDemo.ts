import { getData } from '@/services/RandomUser';
import { useState, useEffect } from 'react';

export default () => {
  const [data, setData] = useState<RandomUser.Record[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getData();
      setData(response?.data ?? []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    fetchData,
  };
};
