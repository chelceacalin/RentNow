import React, { useState, createContext } from "react";
import PropTypes from "prop-types";

export const UserLoginContext = createContext();

function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdmin') === 'true');
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [id, setID] = useState(sessionStorage.getItem('id'));
  const [photoUrl, setPhotoUrl] = useState(sessionStorage.getItem('photoUrl'));

  const loginHandler = (value) => {
    setIsLoggedIn(value);
    sessionStorage.setItem('isLoggedIn', value);
  };

  const adminHandler = (value) => {
    setIsAdmin(value);
    sessionStorage.setItem('isAdmin', value);
  };

  const usernameHandler = (value) => {
    setUsername(value);
    sessionStorage.setItem('username', value);
  };

  const emailHandler = (value) => {
    setEmail(value);
    sessionStorage.setItem('email', value);
  };

  const tokenHandler = (value) => {
    setToken(value);
    sessionStorage.setItem('token', value);
  };

  const idHandler = (value) => {
    setID(value);
    sessionStorage.setItem('id', value);
  };

  const photoUrlHandler = (value) => {
    setPhotoUrl(value);
    sessionStorage.setItem('photoUrl', value);
  };

  return (
    <UserLoginContext.Provider value={{
      isAdmin,
      setIsAdmin: adminHandler,
      username,
      setUsername: usernameHandler,
      token,
      setToken: tokenHandler,
      isLoggedIn,
      setIsLoggedIn: loginHandler,
      id,
      setID: idHandler,
      email,
      setEmail: emailHandler,
      photoUrl,
      setPhotoUrl: photoUrlHandler,
    }}>
      {children}
    </UserLoginContext.Provider>
  );
}

LoginProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginProvider;
