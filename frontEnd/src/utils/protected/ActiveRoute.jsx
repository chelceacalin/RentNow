import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Deactivated from "../../components/Activity/Deactivated";
import { UserLoginContext } from "../context/LoginProvider";
function ActiveRoute() {
  const { is_active } = useContext(UserLoginContext);

  return is_active ? <Outlet /> : <Deactivated />;
}

export default ActiveRoute;
