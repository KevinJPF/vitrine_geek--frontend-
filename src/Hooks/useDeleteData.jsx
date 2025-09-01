import React, { useState } from "react";

export const useDeleteData = (endpoint) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    setResponse(null);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/parking-manager/${endpoint}/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await res.text();

      if (!res.ok) {
        setError(text);
        setResponse(null);
      } else {
        setResponse(text);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setResponse(null);
    }
  };

  return { handleDelete, error, response };
};
