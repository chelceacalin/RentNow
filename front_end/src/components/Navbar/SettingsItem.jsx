import React from "react";
import SettingsIcon from "../../utils/icons/SettingsIcon";
const SettingsItem = ({ selectedItem, handleItemClick, navigate }) => {
  return (
    <li className="rounded-sm">
      <a
        href="#"
        className={`flex items-center p-2 space-x-3 rounded-md ${
          selectedItem === "settings"
            ? "aBackgroundClick"
            : "aBackgroundRelease"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick("settings", "red");
          navigate("/settings");
        }}
      >
        <SettingsIcon isSelected={selectedItem === "settings"} />
        <span
          style={{ fontSize: 16 }}
          className={`${selectedItem === "settings" ? "spanClick" : ""}`}
        >
          Settings
        </span>
      </a>
    </li>
  );
};

export default SettingsItem;
