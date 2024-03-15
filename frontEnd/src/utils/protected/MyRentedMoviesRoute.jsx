import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProfileRoute = () => {
  let { id } = useParams();
  const email = sessionStorage.getItem("email"); // Directly store the returned string
  const route = "/myprofile/myRentedMovies" + email;
  return id === email ? <Outlet /> : <Navigate to={route} />;
};

export default ProfileRoute;
