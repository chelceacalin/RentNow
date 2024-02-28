import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserLoginContext } from "../context/LoginProvider";

function Authenticated() {
  const { isLoggedIn } = useContext(UserLoginContext);

  console.log("Authenticated" +isLoggedIn)
  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />;
}

export default Authenticated;
