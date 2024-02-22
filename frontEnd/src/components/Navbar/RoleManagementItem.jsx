import React from 'react';
import RoleManagementIcon from "../../utils/icons/RoleManagementIcon";
const RoleManagementItem = ({ isAdmin, selectedItem, handleItemClick, navigate }) => {
  return (
    <li className="rounded-sm">
      {isAdmin && (
        <a
          href="#"
          className={`flex items-center p-2 space-x-3 rounded-md ${
            selectedItem === "roleManagement" ? "aBackgroundClick" : "aBackgroundRelease"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleItemClick("roleManagement", "red");
            navigate("/roleManagement");
          }}
        >
          <RoleManagementIcon isSelected={selectedItem === "roleManagement"} />
          <span
            style={{ fontSize: 16 }}
            className={`${
              selectedItem === "roleManagement" ? "spanClick" : "spanRelease"
            }`}
          >
            Role Management
          </span>
        </a>
      )}
    </li>
  );
};

export default RoleManagementItem;
