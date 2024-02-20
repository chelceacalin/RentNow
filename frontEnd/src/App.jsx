import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound/NotFound";
import Movies from "./pages/Movies/Movies";
function App() {
  return (
    <>
      <Router>
        <MainContent />
      </Router>
    </>
  );
}

function MainContent() {
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
