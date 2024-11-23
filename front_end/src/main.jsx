import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

axios.defaults.baseURL = "http://localhost:8079/core";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
