import axios from "axios";
import { useState } from "react";

export const usePostData = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const postData = async (body, headers = {}) => {
    setLoaded(false);
    try {
      const response = await axios.post(url, body, { headers });
      setData(response.data);
      setLoaded(true);
      return response.data;
    } catch (error) {
      setError(error);
      setLoaded(true);
      throw error;
    }
  };

  return { data, error, loaded, postData };
};
