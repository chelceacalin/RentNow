import { useContext, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import Deactivated from "./components/Activity/Deactivated.jsx";
import Navbar from "./components/Navbar/Navbar";
import Books from "./pages/Books/Books.jsx";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import Login from "./pages/Login/Login";
import MyProfile from "./pages/MyBooks/MyProfile";
import Books_MyRentedBooks from "./pages/MyRentedBooks/Books_MyRentedBooks.jsx";
import NotFound from "./pages/NotFound/NotFound";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import LoginProvider, { UserLoginContext } from "./utils/context/LoginProvider";
import ActiveRoute from "./utils/protected/ActiveRoute.jsx";
import AdminRoute from "./utils/protected/AdminRoute";
import Authenticated from "./utils/protected/Authenticated";
import MyRentedBooksRoute from "./utils/protected/MyRentedBooksRoute.jsx";
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
  const { isLoggedIn, is_active } = useContext(UserLoginContext);

  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  // Redirect to /login if not logged in
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Redirect to Deactivated page if the account is not active
  if (!is_active || is_active === "false") {
    return <Deactivated />;
  }

  // Authenticated and active users
  return (
    <>
      <div className="h-screen">
        <Navbar />
      </div>
      <Routes>
        <Route element={<Authenticated />}>
          <Route path="/" element={<Books />} />
          <Route element={<ActiveRoute />}>
            {/* My Rented Books */}
            <Route element={<MyRentedBooksRoute />}>
              <Route
                path="/myprofile/myRentedBooks/:id"
                element={<Books_MyRentedBooks />}
              />
            </Route>

            {/* My Profile */}
            <Route element={<ProfileRoute />}>
              <Route path="/myprofile/:id" element={<MyProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route
                path="/categoryManagement"
                element={<CategoryManagement />}
              />
              <Route path="/roleManagement" element={<RoleManagement />} />
            </Route>

            {/* Catch-all for authenticated users */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Public login route */}
        <Route path="/login" element={<Login />} />

        {/* Remove redundant catch-all route */}
      </Routes>
    </>
  );
}

export default App;
