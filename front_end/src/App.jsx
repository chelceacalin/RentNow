import { dark } from "@mui/material/styles/createPalette.js";
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
import ChatMessenger from "./components/Chat/ChatMessenger.jsx";
import Navbar from "./components/Navbar/Navbar";
import Books_PendingBooks from "./pages/Admin-PendingBooks/Books_PendingBooks.jsx";
import Books from "./pages/Books/Books.jsx";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import Login from "./pages/Login/Login";
import MyProfile from "./pages/MyBooks/MyProfile";
import NewsLetter from "./pages/NewsLetter.jsx";
import NotFound from "./pages/NotFound/NotFound";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import Settings from "./pages/Settings/Settings.jsx";
import Books_MyRentedBooks from "./pages/USER-RentedBooks/Books_MyRentedBooks.jsx";
import LoginProvider, { UserLoginContext } from "./utils/context/LoginProvider";
import { ReviewsProvider } from "./utils/context/ReviewsContext.jsx";
import { UserProvider } from "./utils/context/UserContext.jsx";
import { useSessionStorageState } from "./utils/hooks/UseSessionStorage.jsx";
import ActiveRoute from "./utils/protected/ActiveRoute.jsx";
import AdminRoute from "./utils/protected/AdminRoute";
import Authenticated from "./utils/protected/Authenticated";
import MyRentedBooksRoute from "./utils/protected/MyRentedBooksRoute.jsx";
import ProfileRoute from "./utils/protected/ProfileRoute";
import axios from "axios";
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
  const { isLoggedIn, is_active, email } = useContext(UserLoginContext);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);


  if (!initialized) return null;
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/subscriptions/unsubscribe/:id" element={<NewsLetter />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (initialized) {
    axios.get(`/users/${email}/settings`).then((response) => {
      const data = response.data;
      if (data.darkModeEnabled === "true") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

    });
  }

  if (!is_active || is_active === "false") {
    return <Deactivated />;
  }

  return (
    <>
      <ChatMessenger />
      <div className="h-screen">
        <Navbar />
      </div>
      <Routes>
        <Route element={<Authenticated />}>
          <Route path="/" element={<Books />} />

          <Route element={<ActiveRoute />}>
            {/* My Rented Books Route */}
            <Route element={<MyRentedBooksRoute />}>
              <Route
                path="/myprofile/myRentedBooks/:id"
                element={<Books_MyRentedBooks />}
              />
              <Route
                path="/myRentedBooks/:id"
                element={<Books_MyRentedBooks />}
              />
            </Route>

            {/* Profile Route */}
            <Route element={<ProfileRoute />}>
              <Route path="/myprofile/:id" element={<MyProfile />} />
            </Route>

            {/* Pending Books */}
            <Route
              path="/myprofile/pendingBooks"
              element={<Books_PendingBooks />}
            />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route
                path="/categoryManagement"
                element={<CategoryManagement />}
              />
              <Route path="/roleManagement" element={<RoleManagement />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Login Route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
