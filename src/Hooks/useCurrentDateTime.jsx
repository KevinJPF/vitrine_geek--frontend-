import { useEffect, useState } from "react";

export const useCurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const year = currentDateTime.getFullYear();
  const month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
  const day = String(currentDateTime.getDate()).padStart(2, "0");
  const hours = String(currentDateTime.getHours()).padStart(2, "0");
  const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  const timestamp = currentDateTime.getTime();

  return { formattedDate, formattedTime, timestamp };
};
