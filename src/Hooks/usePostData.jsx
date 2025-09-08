import { useState } from "react";

export const usePostData = () => {
  const [response, setResponse] = useState(null);

  const postApiData = async (endpoint, body) => {
    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
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

      const responseData = await response.json(); // Altere para .text() para ler a resposta como string
      setResponse(responseData);
      return responseData; // Retorne a resposta como string
    } catch (error) {
      console.error("Error during fetch:", error);
      return error;
    }
  };

  return { postApiData, response };
};
