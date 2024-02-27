import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserLoginContext } from "../context/LoginProvider";
import { useParams } from "react-router-dom";

const MyRentedMoviesRoute = () => {
  let { id } = useParams();

  const { email } =sessionStorage.getItem("email");
  const route = "/myRentedMovies/" + email;
  return id === email ? <Outlet /> : <Navigate to={route} />;
};

export default MyRentedMoviesRoute;
