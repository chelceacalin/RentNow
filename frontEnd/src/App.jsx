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
import { ReviewsProvider } from "./utils/context/ReviewsContext.jsx";
import { UserProvider } from "./utils/context/UserContext.jsx";
import ActiveRoute from "./utils/protected/ActiveRoute.jsx";
import AdminRoute from "./utils/protected/AdminRoute";
import Authenticated from "./utils/protected/Authenticated";
import MyRentedBooksRoute from "./utils/protected/MyRentedBooksRoute.jsx";
import ProfileRoute from "./utils/protected/ProfileRoute";
function App() {
  return (
    <div className="app-container">
      <LoginProvider>
        <UserProvider>
          <ReviewsProvider>
            <Router>
              <MainContent />
            </Router>
          </ReviewsProvider>
          <ToastContainer />
        </UserProvider>
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
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (!is_active || is_active === "false") {
    return <Deactivated />;
  }

  return (
    <>
      <div className="h-screen">
        <Navbar />
      </div>
      <Routes>
        <Route element={<Authenticated />}>
          <Route path="/" element={<Books />} />
          <Route element={<ActiveRoute />}>
            <Route element={<MyRentedBooksRoute />}>
              <Route
                path="/myprofile/myRentedBooks/:id"
                element={<Books_MyRentedBooks />}
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

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
