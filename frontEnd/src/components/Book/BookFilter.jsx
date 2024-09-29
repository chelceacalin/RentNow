import { Autocomplete, TextField, styled } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./css/BookFilter.scss";
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

function BookFilter({
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
    axios.get(`/books`).then((response) => {
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
    <div className="filter-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <input
            id="search-title"
            name="title"
            type="search"
            placeholder="Search title"
            className="filter-search-input"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <input
            id="search-director"
            name="director"
            type="search"
            placeholder="Search director"
            className="filter-search-input"
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
                className="filter-search-input"
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
                className="filter-search-input"
              />
            )}
            value={rentedBy}
            onChange={(_, newValue) => setRentedBy(newValue)}
          />
        </div>
        <div className="col-span-1 flex selectBoxes">
          <div className="flex gap-8 ml-4 mt-0">
            <div className="w-52">
              <span htmlFor="" className="text-white">
                Status
              </span>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="filter-search-input"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
                <option value="ALL">All</option>
              </select>
            </div>
            <div className="w-52">
              <span htmlFor="" className="text-white">
                Sort Field
              </span>
              <select
                value={sortField}
                onChange={handleSortFieldChange}
                className="filter-search-input"
              >
                <option value="title">Title</option>
                <option value="director">Director</option>
                <option value="rentedDate">Rented Date</option>
              </select>
            </div>

            <div className="w-52">
              <span htmlFor="" className="text-white">
                Sort Direction
              </span>
              <select
                value={direction ? "ASC" : "DESC"}
                onChange={handleDirectionChange}
                className="filter-search-input"
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

export default BookFilter;
