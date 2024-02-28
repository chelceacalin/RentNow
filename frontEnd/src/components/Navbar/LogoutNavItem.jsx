
import React from 'react';
import LogoutIcon from "../../utils/icons/LogoutIcon";
const LogoutNavItem = ({ isAdmin, selectedItem, handleItemClick, setIsAdmin, setIsLoggedIn, setUsername, setToken, url }) => {

  return (
    <li className="rounded-sm">
      <a
        href="#"
        className={`flex items-center p-2 space-x-3 rounded-md ${
          selectedItem === "logout" ? "aBackgroundClick" : "aBackgroundRelease"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick("logout", "red");
          setIsAdmin(false);
          setIsLoggedIn(false);
          setUsername(null);
          setToken(null);
        }}
      >
        <LogoutIcon isSelected={selectedItem === "logout"} />
        <span
          style={{ fontSize: 16 }}
          className={`${
            selectedItem === "logout" ? "spanClick" : ""
          }`}
        >
          Log Out
        </span>
      </a>
    </li>
  );
};

export default LogoutNavItem;
