import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppIcon from "../../utils/icons/AppIcon";
import CategoryManagementItem from "./CategoryManagementItem";
import LogoutNavItem from "./LogoutNavItem";
import MovieNavItem from "./MovieNavItem";
import ProfileNavItem from "./ProfileNavItem";
import RoleManagementItem from "./RoleManagementItem";
import "./css/Navbar.css";
import axios from "axios"
function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();

  let url=axios.defaults.baseURL;
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const {
    isAdmin,
    setIsAdmin,
    username,
    setUsername,
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
  } = {
    isAdmin: true,
    setIsAdmin: true,
    username: false,
    setUsername: false,
    token: false,
    setToken: false,
    isLoggedIn: true,
    setIsLoggedIn: true,
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedItem("Movies");
      setSelectedColor("Red");
    } else if (location.pathname.includes("profile")) {
      setSelectedItem("profile");
      setSelectedColor("red");
    } else {
      setSelectedItem(location.pathname.substring(1, location.pathname.length));
      setSelectedColor("red");
    }
  }, [location.pathname]);

  const handleItemClick = (item, color) => {
    if (selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
      setSelectedColor(color);
    }
  };

  return (
    <div className="flex h-screen w-auto navbar">
      <div className="flex flex-col h-full p-3 bg-white shadow w-60">
        <div className="flex flex-col h-full space-y-3 justify-between">
          <div className="flex items-center mt-10 ml-3">
            <AppIcon />
          </div>

          <div className="overflow-y-auto">
            <ul className="flex flex-col pt-2 pb-4 space-y-1 text-sm ">
              <MovieNavItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
              />
              <ProfileNavItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
              />

              <RoleManagementItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
                isAdmin={isAdmin}
              />

              <CategoryManagementItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
                isAdmin={isAdmin}
              />
            </ul>
          </div>
          <div className="mt-auto">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <LogoutNavItem
                isAdmin={isAdmin}
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                setIsAdmin={setIsAdmin}
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setToken={setToken}
                url={url}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
