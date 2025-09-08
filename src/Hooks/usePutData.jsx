import React, { useState } from "react";

export const usePutData = () => {
  const [response, setResponse] = useState(null);

  const putApiData = async (endpoint, id, body) => {
    try {
      const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("Error response:", errorMessage);
        return errorMessage;
      }
      const data = await response.json();
      setResponse(data);
      return data;
    } catch (error) {
      console.error("Error during fetch:", error);
      return error;
    }
  };

  return { putApiData, response };
};
