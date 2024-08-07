import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { Autocomplete, TextField, styled } from "@mui/material";
import "./css/MovieFilter.scss"
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-option": {
    color: "white",
    backgroundColor: "gray",
  },
  "& .MuiAutocomplete-option.Mui-selected": {
    backgroundColor: "darkgray",
  },
  "& .MuiAutocomplete-inputRoot": {
    color: "white",
  },
}));

function MovieFilter({
  filterInput,
  handleSortFieldChange,
  handleDirectionChange,
  sortField,
  direction,
}) {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [availability, setAvailability] = useState("ALL");
  const [rentedBy, setRentedBy] = useState(null);
  const [usersWhoRented, setUsersWhoRented] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get(`/movies`).then((response) => {
      setUsersWhoRented(response.data.content);
      const filteredElems = response.data.content.filter(
        (elem) => elem.rentedBy !== "available"
      );
      const uniqueUsers = [
        ...new Map(filteredElems.map((item) => [item.rentedBy, item])).values(),
      ];
      setFilteredUsers(uniqueUsers);
    });

    axios.get("/category").then((response) => {
      setCategories(response.data.content.map((item) => item.name));
    });
  }, []);

  const debouncedFilterInput = useDebouncedCallback((array) => {
    filterInput(array);
  }, 500);

  useEffect(() => {
    const array = [selectedCategory, director, title, availability, rentedBy];
    debouncedFilterInput(array);
  }, [selectedCategory, director, title, availability, rentedBy]);

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <input
            id="search-title"
            name="title"
            type="search"
            placeholder="Search title"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <input
            id="search-director"
            name="director"
            type="search"
            placeholder="Search director"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
            onChange={(e) => setDirector(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <StyledAutocomplete
            options={categories}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Category"
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
              />
            )}
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
          />
        </div>
        <div className="col-span-1">
          <StyledAutocomplete
            options={filteredUsers.map((user) => user.rentedBy)}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Rented by"
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
              />
            )}
            value={rentedBy}
            onChange={(_, newValue) => setRentedBy(newValue)}
          />
        </div>
        <div className="col-span-1 flex selectBoxes">
          <div className="flex gap-8 ml-4 mt-0">
            <div className="w-52">
            <span htmlFor="" className="text-white">Status</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
          >
            <option value="ALL">All</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
            </div>
            <div className="w-52">
              <span htmlFor="" className="text-white">Sort Field</span>
              <select
                value={sortField}
                onChange={handleSortFieldChange}
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
              >
                <option value="title">Title</option>
                <option value="director">Director</option>
                <option value="rentedDate">Rented Date</option>
              </select>
            </div>

            <div className="w-52">
            <span htmlFor="" className="text-white">Sort Direction</span>
              <select
                value={direction ? "ASC" : "DESC"}
                onChange={handleDirectionChange}
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieFilter;
