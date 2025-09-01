import { useState } from "react";

export const usePostData = () => {
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postApiData = async (data, endpoint) => {
    try {
      const response = await fetch(
        `http://localhost:8080/ecommerce/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text(); // Ler a resposta como texto
        console.error("Error response:", errorMessage);
        setError(errorMessage);
        throw new Error("Network response was not ok");
      }

      const responseData = await response.text(); // Altere para .text() para ler a resposta como string
      setError(null);
      setResponse(responseData);
      return responseData; // Retorne a resposta como string
    } catch (error) {
      console.error("Error during fetch:", error);
      // setResponse(null);
      // setError(error.message);
      // return null;
    }
  };

  return { postApiData, error, setError, response };
};
