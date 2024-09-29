import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

const MyRentedBooksRoute = () => {
  let { id } = useParams();
  const email = sessionStorage.getItem("email");
  const route = "/myprofile/myRentedBooks" + email;
  return id === email ? <Outlet /> : <Navigate to={route} />;
};

export default MyRentedBooksRoute;
