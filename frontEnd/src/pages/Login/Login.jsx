import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import { auth, provider } from "../../utils/firebase/firebase.js";
import AppIcon from "../../utils/icons/AppIcon";
import "./css/Login.scss";

function Login() {
  let url = axios.defaults.baseURL;

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
        let userData = data.user;
        const userDetails = {
          email: userData.email,
          firstName: userData.displayName.split(" ")[0],
          lastName: userData.displayName.split(" ")[1],
          username: userData.displayName,
          photoUrl: userData.photoURL,
        };

        axios.post(url + "/users/addUser", userDetails).then((response) => {
          if (response.status == 200) {
            let data = response.data;
            setUsername(data.username);
            setEmail(data.email);
            setID(data.id);
            setIsAdmin(data.role == "ADMIN");
            setIsLoggedIn(true);
          }
        });
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
      <Box
        className="loginButtons"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
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
