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
  const [role, setRole] = useSessionStorageState("role", "");
  const [token, setToken] = useSessionStorageState("token", "");
  const [id, setID] = useSessionStorageState("id", "");
  const [photoUrl, setPhotoUrl] = useSessionStorageState("photoUrl", "");
  const [is_active, set_isActive] = useSessionStorageState("is_active", "");
  const [darkModeEnabled, setDarkModeEnabled] =
    useSessionStorageState("darkModeEnabled");

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
        darkModeEnabled,
        setDarkModeEnabled,
        role,
        setRole
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
