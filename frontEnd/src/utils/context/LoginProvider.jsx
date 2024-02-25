import React, { useState, createContext } from "react";
import PropTypes from "prop-types";

export const UserLoginContext = createContext();

function LoginProvider({ children }) {
  let [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn'));
  let [isAdmin, setIsAdmin] = useState(false);
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [token, setToken] = useState("");
  let [id, setID] = useState("");
  let [photoUrl,setPhotoUrl] = useState("");

  let loginHandler = (value) => {
    setIsLoggedIn(value)
    sessionStorage.setItem('isLoggedIn', value);
  }

  return(
    <UserLoginContext.Provider  value={{
        isAdmin,
        setIsAdmin,
        username,
        setUsername,
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn:loginHandler,
        id,
        setID,
        email,
        setEmail,
        photoUrl,
        setPhotoUrl
      }} >
        {children}
    </UserLoginContext.Provider>
  );
}

LoginProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  
export default LoginProvider;
