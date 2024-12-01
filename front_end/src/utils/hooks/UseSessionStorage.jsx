import { useCallback, useState } from "react";

export const useSessionStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue === "true") {
      return true;
    }
    if (storedValue === "false") {
      return false;
    }

    if (key === "isLoggedIn" || key === "isAdmin") {
      return storedValue === "true";
    }
    return storedValue !== null ? storedValue : defaultValue;
  });

  const setSessionStorageState = useCallback(
    (value) => {
      setState(value);
      sessionStorage.setItem(key, value);
    },
    [key]
  );

  return [state, setSessionStorageState];
};
