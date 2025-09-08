import React, { useState } from "react";

export const useGetData = () => {
  const [data, setData] = useState(null);

  const getApiData = async (endpoint, query) => {
    try {
      const url = `http://localhost:3000/${endpoint}?${query}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error("Network response was not ok: " + errorMessage);
      }
      const data = await response.json();
      setData(data);

      return data;
    } catch (error) {
      return error;
    }
  };

  return { getApiData, data };
};
