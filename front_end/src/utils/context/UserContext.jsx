import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [refreshImg, setRefreshImg] = useState(false);

  return (
    <UserContext.Provider value={{ refreshImg, setRefreshImg }}>
      {children}
    </UserContext.Provider>
  );
};
