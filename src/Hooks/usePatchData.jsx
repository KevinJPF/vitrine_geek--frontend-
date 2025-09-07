import React, { useState } from "react";

export const usePatchData = () => {
  const [response, setResponse] = useState(null);

  const patchApiData = async (endpoint, id, body = {}) => {
    try {
      const res = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: "PATCH",
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
      return res;
    } catch (error) {
      setResponse(null);
      return error.message;
    }
  };

  return { patchApiData, response };
};
