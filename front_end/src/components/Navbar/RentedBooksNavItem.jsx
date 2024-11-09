import React from "react";
import RentedBookIcon from "../../utils/icons/RentedBookIcon";
const RentedBooksNavItem = ({
  selectedItem,
  handleItemClick,
  navigate,
  email,
}) => {
  return (
    <li className="rounded-sm">
      <a
        href="#"
        className={`flex items-center p-2 space-x-3 rounded-md ${
          selectedItem === "rentedBooks"
            ? "aBackgroundClick"
            : "aBackgroundRelease"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick("rentedBooks", "red");
          navigate(`/myRentedBooks/${email}`);
        }}
      >
        <RentedBookIcon isSelected={selectedItem === "rentedBooks"} />
        <span
          style={{ fontSize: 16 }}
          className={`${selectedItem === "rentedBooks" ? "spanClick" : ""}`}
        >
          Rented Books
        </span>
      </a>
    </li>
  );
};

export default RentedBooksNavItem;
