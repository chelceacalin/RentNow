import PropTypes from "prop-types";
import React, { createContext } from "react";
import { useSessionStorageState } from "../hooks/UseSessionStorage";
export const UserLoginContext = createContext();

function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useSessionStorageState(
    "isLoggedIn",
    "false"
  );
  const [isAdmin, setIsAdmin] = useSessionStorageState("isAdmin", "false");
  const [username, setUsername] = useSessionStorageState("username", "");
  const [email, setEmail] = useSessionStorageState("email", "");
  const [token, setToken] = useSessionStorageState("token", "");
  const [id, setID] = useSessionStorageState("id", "");
  const [photoUrl, setPhotoUrl] = useSessionStorageState("photoUrl", "");
  const [is_active, set_isActive] = useSessionStorageState("is_active", "");

  return (
    <UserLoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
        username,
        setUsername,
        email,
        setEmail,
        token,
        setToken,
        id,
        setID,
        photoUrl,
        setPhotoUrl,
        is_active,
        set_isActive,
      }}
    >
      {children}
    </UserLoginContext.Provider>
  );
}

LoginProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginProvider;
