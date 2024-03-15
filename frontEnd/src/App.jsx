import { useContext, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import Navbar from "./components/Navbar/Navbar";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import Login from "./pages/Login/Login";
import Movies from "./pages/Movies/Movies";
import MyProfile from "./pages/MyMovies/MyProfile";
import MyRentedMovies from "./pages/MyRentedMovies/MyRentedMovies";
import NotFound from "./pages/NotFound/NotFound";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import LoginProvider, { UserLoginContext } from "./utils/context/LoginProvider";
import AdminRoute from "./utils/protected/AdminRoute";
import Authenticated from "./utils/protected/Authenticated";
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
    setInitialized(true);
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

            <Route element={<MyRentedMoviesRoute />}>
              <Route
                path="/myprofile/myRentedMovies/:id"
                element={<MyRentedMovies />}
              />
            </Route>

            <Route element={<ProfileRoute />}>
              <Route path="/myprofile/:id" element={<MyProfile />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route
                path="/categoryManagement"
                element={<CategoryManagement />}
              />
              <Route path="/roleManagement" element={<RoleManagement />} />
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
