import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProfileRoute = () => {
  let { id } = useParams();
  const email = sessionStorage.getItem("email");
  const route = "/myprofile/" + email;
  return id === email ? <Outlet /> : <Navigate to={route} />;
};

export default ProfileRoute;
