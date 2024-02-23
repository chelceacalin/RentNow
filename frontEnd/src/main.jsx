import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
