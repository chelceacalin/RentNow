import "./App.scss";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound/NotFound";
import Movies from "./pages/Movies/Movies";
import LoginProvider from "./utils/context/LoginProvider";
import { UserLoginContext } from "./utils/context/LoginProvider";
import Login from "./pages/Login/Login";
import Authenticated from "./utils/protected/Authenticated";
import MyProfile from "./pages/MyMovies/MyProfile";
import MyRentedMoviesRoute from "./utils/protected/MyRentedMoviesRoute";
import ProfileRoute from "./utils/protected/ProfileRoute";
function App() {
  return (
    <div className="app-container">
      <LoginProvider>
        <Router>
          <MainContent />
        </Router>
        <ToastContainer />
      </LoginProvider>
    </div>
  );
}

function MainContent() {
  const [initialized, setInitialized] = useState(false);
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

  useEffect(() => {
    setInitialized(true)
  }, []);


  if (!initialized) return null; 

  if (isLoggedIn) {
    return (
      <>
        <div className="h-screen">
          <Navbar />
        </div>
        <Routes>
          <Route element={<Authenticated />}>
            <Route index path="/" element={<Movies />} />
            <Route element={<ProfileRoute />}>
          <Route path="/myprofile/:id" element={<MyProfile />} />
        </Route>
        
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </>
    );
  } else {
    return (
      <Routes>
        <Route element={<Login />} index="/login" />
      </Routes>
    );
  }
}

export default App;
