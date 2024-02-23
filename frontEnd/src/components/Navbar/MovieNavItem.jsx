import React from 'react';
import MovieIcon from "../../utils/icons/MovieIcon";
const MovieNavItem = ({ selectedItem, handleItemClick, navigate }) => {
  return (
    <li className="rounded-sm">
      <a
        href="#"
        className={`flex items-center p-2 space-x-3 rounded-md ${
          selectedItem === "Movies" ? "aBackgroundClick" : "aBackgroundRelease"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick("Movies", "red");
          navigate("/");
        }}
      >
        <MovieIcon isSelected={selectedItem === "Movies"} />
        <span
          style={{ fontSize: 16 }}
          className={`${
            selectedItem === "Movies" ? "spanClick" : ""
          }`}
        >
          Movies
        </span>
      </a>
    </li>
  );
};

export default MovieNavItem;
