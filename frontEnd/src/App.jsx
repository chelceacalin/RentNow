import { useContext, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import Navbar from "./components/Navbar/Navbar";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import Login from "./pages/Login/Login";
import Books from "./pages/Books/Books.jsx";
import MyProfile from "./pages/MyBooks/MyProfile";
import Books_MyRentedBooks from "./pages/MyRentedBooks/Books_MyRentedBooks.jsx";
import NotFound from "./pages/NotFound/NotFound";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import LoginProvider, { UserLoginContext } from "./utils/context/LoginProvider";
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
  const { isLoggedIn } = useContext(UserLoginContext);

  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return isLoggedIn ? (
    <>
      <div className="h-screen">
        <Navbar />
      </div>
      <Routes>
        <Route element={<Authenticated />}>
          <Route index path="/" element={<Books />} />

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
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  ) : (
    <Routes>
      <Route element={<Login />} index="/login" />
    </Routes>
  );
}

export default App;
