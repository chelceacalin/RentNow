import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import { auth, provider } from "../../utils/firebase/firebase.js";
import AppIconUnformatted from "../../utils/icons/AppIconUnformatted.jsx";

const defaultTheme = createTheme();

function Login() {
  let url = axios.defaults.baseURL;
  let navigate = useNavigate();
  const githubProvider = new GithubAuthProvider();
  const {
    setIsAdmin,
    setUsername,
    setIsLoggedIn,
    setID,
    setEmail,
    set_isActive,
  } = useContext(UserLoginContext);

  const getUserDetails = (userData, providerName = "google") => {
    let firstName = userData.displayName.split(" ")[0];
    let lastName = userData.displayName.split(" ")[1];
    let email = userData.email;

    if (providerName === "github" && !email) {
      email =
        firstName.replaceAll(" ", "").toLowerCase() +
        "." +
        lastName.replaceAll(" ", "").toLowerCase() +
        "@yahoo.com";
    }

    return {
      email: email,
      firstName: firstName,
      lastName: lastName,
      username: userData.displayName,
      photoUrl: userData.photoURL,
      is_active: userData.is_active,
    };
  };

  const handleUserLogin = (userDetails) => {
    axios
      .post(url + "/users/addUser", userDetails)
      .then((response) => {
        const data = response.data;
        setUsername(userDetails.firstName);
        setEmail(userDetails.email);
        setID(data.id);
        setIsAdmin(data.role === "ADMIN");
        setIsLoggedIn(true);
        set_isActive(data.is_active);
        navigate("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        const userDetails = getUserDetails(data.user);
        handleUserLogin(userDetails);
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  };

  const handleSignInWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((data) => {
        const userDetails = getUserDetails(data.user, "github");
        handleUserLogin(userDetails);
      })
      .catch((error) => {
        console.error("Error signing in with GitHub:", error);
      });
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://github.com/chelceacalin">
          Chelcea Calin
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        className="w-full"
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={5}
          sx={{
            backgroundImage: 'url("Images/book_rental.jpg")',
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
          <div className="bg-main-color-reverse flex justify-center">
            <AppIconUnformatted />
          </div>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome Back!
            </Typography>
            <Typography
              component="p"
              variant="body2"
              sx={{ mt: 2, mb: 4, textAlign: "center" }}
            >
              Please sign in to continue to our book rental service.
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: "100%", textAlign: "center" }}
            >
              <button
                className="rent-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignInWithGoogle();
                }}
              >
                <GoogleIcon /> &nbsp; Sign in with Google
              </button>
              <button
                className="details-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignInWithGithub();
                }}
              >
                <GitHubIcon /> &nbsp; Sign in with GitHub
              </button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
