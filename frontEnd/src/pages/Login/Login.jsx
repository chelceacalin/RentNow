import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import { auth, provider } from "../../utils/firebase/firebase.js";
import AppIcon from "../../utils/icons/AppIcon";
import "./css/Login.scss";

function Login() {
  let url = axios.defaults.baseURL;
  const githubProvider = new GithubAuthProvider();
  const {
    setIsAdmin,
    setUsername,
    setIsLoggedIn,
    setID,
    setEmail,
  } = useContext(UserLoginContext);

  const handleSignInWithGoogle = () => {
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
          if (response.status === 200) {
            let data = response.data;
            setUsername(data.username);
            setEmail(data.email);
            setID(data.id);
            setIsAdmin(data.role === "ADMIN");
            setIsLoggedIn(true);
          }
        });
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  };

  const handleSignInWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((data) => {
        let userData = data.user;

        let email = userData.email
          ? userData.email
          : userData.displayName
              .split(" ")[0]
              .replaceAll(" ", "")
              .toLowerCase() +
            "." +
            userData.displayName
              .split(" ")[1]
              .replaceAll(" ", "")
              .toLowerCase() +
            "@yahoo.com";

        let firstName = userData.displayName.split(" ")[0];
        let lastName = userData.displayName.split(" ")[1];
        const userDetails = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          username: userData.displayName,
          photoUrl: userData.photoURL,
        };
        axios.post(url + "/users/addUser", userDetails).then((response) => {
          if (response.status === 200) {
            let data = response.data;
            setUsername(firstName);
            setEmail(email);
            setID(data.id);
            setIsAdmin(data.role === "ADMIN");
            setIsLoggedIn(true);
          }
        });
      })
      .catch((error) => {
        console.error("Error signing in with GitHub:", error);
      });
  };

  return (
    <div className="loginContainer overflow-y-hidden">
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
          onClick={handleSignInWithGoogle}
        >
          Sign in with Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<GitHubIcon />}
          onClick={handleSignInWithGithub}
        >
          Sign in with GitHub
        </Button>
      </Box>
    </div>
  );
}

export default Login;
