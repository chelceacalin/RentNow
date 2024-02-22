// Assuming this is part of a larger component

import React from 'react';
import CategoryManagementIcon from "../../utils/icons/CategoryManagementIcon";
const CategoryManagementItem = ({ isAdmin, selectedItem, handleItemClick, navigate }) => {
  return (
    <li className="rounded-sm">
      {isAdmin && (
        <a
          href="#"
          className={`flex items-center p-2 space-x-3 rounded-md ${
            selectedItem === "categoryManagement" ? "aBackgroundClick" : "aBackgroundRelease"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleItemClick("categoryManagement", "red");
            navigate("/categoryManagement");
          }}
        >
          <CategoryManagementIcon isSelected={selectedItem === "categoryManagement"} />
          <span
            style={{ fontSize: 16 }}
            className={`${
              selectedItem === "categoryManagement" ? "spanClick" : "spanRelease"
            }`}
          >
            Category Management
          </span>
        </a>
      )}
    </li>
  );
};

export default CategoryManagementItem;
