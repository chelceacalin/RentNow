import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserLoginContext } from "../context/LoginProvider";

function AdminRoute() {
  let { isAdmin } = useContext(UserLoginContext);
  return isAdmin ? <Outlet /> : <Navigate to={"/"} />;
}

export default AdminRoute;
