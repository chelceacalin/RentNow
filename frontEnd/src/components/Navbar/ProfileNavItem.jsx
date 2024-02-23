
import React from 'react';
import ProfileIcon from "../../utils/icons/ProfileIcon";
const ProfileNavItem = ({ selectedItem, handleItemClick, navigate, username }) => {
  return (
    <li className="rounded-sm">
      <a
        href="#"
        className={`flex items-center p-2 space-x-3 rounded-md ${
          selectedItem === "profile" ? "aBackgroundClick" : "aBackgroundRelease"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick("profile", "red");
          navigate(`/myprofile/${username}`);
        }}
      >
        <ProfileIcon isSelected={selectedItem === "profile"} />
        <span
          style={{ fontSize: 16 }}
          className={`${
            selectedItem === "profile" ? "spanClick" : ""
          }`}
        >
          Profile
        </span>
      </a>
    </li>
  );
};

export default ProfileNavItem;
