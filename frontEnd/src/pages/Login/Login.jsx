import React,{useContext} from "react";
import axios from "axios";
import { Button, Box } from "@mui/material";
import "./css/Login.scss";
import AppIcon from "../../utils/icons/AppIcon";
import { auth, provider } from "../../utils/firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";

function Login() {
    const {
        isAdmin,
        setIsAdmin,
        username,
        setUsername,
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn,
        id,
        setID,
        email,
        setEmail,
      } = useContext(UserLoginContext);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        const userDetails = {
          email: data.user.email,
          firstName: data.user.displayName.split(" ")[0],
          lastName: data.user.displayName.split(" ")[1],
          username: data.user.displayName,
          photoUrl: data.user.photoURL
        };
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  return (
    <div className="loginContainer">
      <div className="logoContainer">
        <AppIcon className="logo" />
      </div>
      <Box className="loginButtons" display="flex" alignItems="center" justifyContent="center" height="100%">
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleSignIn}
        >
          Sign in with Google
        </Button>
      </Box>
    </div>
  );
}

export default Login;
