export const useCepFetchData = () => {
  const fetchCepData = async (cep) => {
    try {
      const url = `https://viacep.com.br/ws/${cep}/json/`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error("Network response was not ok: " + errorMessage);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return error;
    }
  };

  return { fetchCepData };
};
