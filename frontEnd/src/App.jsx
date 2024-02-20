import "./App.css";
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
function App() {
  return (
    <div className="app-container">
    <LoginProvider>
        <Router>
            <MainContent/>
        </Router>
        <ToastContainer/>
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

  
  return (
    <>
      <div className="h-screen">
        <Navbar />
      </div>
      <Routes>
        <Route index path="/" element={<Movies />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
