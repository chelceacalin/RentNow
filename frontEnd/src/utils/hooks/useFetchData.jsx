import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadAsyncStuff = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoaded(true);
      }
    };

    if (url) {
      loadAsyncStuff();
    }
  }, [url, ...dependencies]);

  return { data, error, loaded };
};
