import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import { auth, provider } from "../../utils/firebase/firebase.js";
import Avatar from "@mui/material/Avatar";
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppIconUnformatted from "../../utils/icons/AppIconUnformatted.jsx";
const defaultTheme = createTheme();

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

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/chelceacalin">
           Chelcea Calin
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <AppIconUnformatted/>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url("/public/Images/movie_rental.avif")',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome Back!
            </Typography>
            <Typography component="p" variant="body2" sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
              Please sign in to continue to our movie rental service.
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleSignInWithGoogle}
                sx={{ mt: 2, mb: 2 }}
              >
                Sign in with Google
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<GitHubIcon />}
                onClick={handleSignInWithGithub}
                sx={{ mt: 2, mb: 2 }}
              >
                Sign in with GitHub
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
