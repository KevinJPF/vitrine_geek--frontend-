import React, { useState } from "react";

export const usePutData = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const putApiData = async (endpoint, body) => {
    try {
      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }
      const data = await res.text();
      setResponse(data);
      setError(null);
      return response;
    } catch (error) {
      setError(error.message);
      setResponse(null);
      return error.message;
    }
  };

  return { putApiData, response, error };
};
