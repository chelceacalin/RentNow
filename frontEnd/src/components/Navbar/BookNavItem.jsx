import React from 'react';
import BookIcon from "../../utils/icons/BookIcon.jsx";
const BookNavItem = ({ selectedItem, handleItemClick, navigate }) => {
  return (
    <li className="rounded-sm">
      <a
        href="#"
        className={`flex items-center p-2 space-x-3 rounded-md ${
          selectedItem === "Books" ? "aBackgroundClick" : "aBackgroundRelease"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick("Books", "red");
          navigate("/");
        }}
      >
        <BookIcon isSelected={selectedItem === "Books"} />
        <span
          style={{ fontSize: 16 }}
          className={`${
            selectedItem === "Books" ? "spanClick" : ""
          }`}
        >
          Books
        </span>
      </a>
    </li>
  );
};

export default BookNavItem;
