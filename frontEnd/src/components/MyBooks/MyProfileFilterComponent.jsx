import { TextField, styled } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { UserLoginContext } from "../../utils/context/LoginProvider";

const StyledAutocomplete = styled(TextField)(({ _ }) => ({
  "& .MuiInputBase-root": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "gray",
  },
}));

function MyProfileFilterComponent({ onFilterChange }) {
  const [filterValues, setFilterValues] = useState({
    title: "",
    director: "",
    category: "",
    rentedUntil: null,
    rentedBy: null,
    availability: "ALL",
  });
  const [usersWhoRented, setUsersWhoRented] = useState([]);
  const { username } = useContext(UserLoginContext);

  const debouncedFilterChange = useDebouncedCallback((newFilters) => {
    onFilterChange(newFilters);
  }, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/books`, {
          params: { owner_username: username },
        });
        const users = response.data.content
          .filter((book) => book.rentedBy && book.rentedBy !== "available")
          .map((book) => book.rentedBy);
        setUsersWhoRented([...new Set(users)]);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [username]);

  useEffect(() => {
    const status = filterValues.availability;
    const filters = {
      title: filterValues.title,
      director: filterValues.director,
      category: filterValues.category,
      rentedUntil: filterValues.rentedUntil ? filterValues.rentedUntil : "",
      rentedBy: filterValues.rentedBy,
      isAvailable: status === "ALL" ? "" : status,
    };
    debouncedFilterChange(filters);
  }, [filterValues]);

  const handleInputChange = (field) => (event, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [field]: value !== undefined ? value : event.target.value,
    }));
  };

  return (
    <div className="filter-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <input
            type="search"
            placeholder="Search title"
            className="filter-search-input"
            value={filterValues.title}
            onChange={handleInputChange("title")}
          />
        </div>

        <div className="col-span-1">
          <input
            type="search"
            placeholder="Search director"
            className="filter-search-input"
            value={filterValues.director}
            onChange={handleInputChange("director")}
          />
        </div>

        <div className="col-span-1">
          <input
            type="search"
            placeholder="Search category"
            className="filter-search-input"
            value={filterValues.category}
            onChange={handleInputChange("category")}
          />
        </div>

        <div className="col-span-1">
          <span className="text-white">Rented By</span>
          <StyledAutocomplete
            select
            value={filterValues.rentedBy || ""}
            onChange={handleInputChange("rentedBy")}
            className="filter-search-input"
            SelectProps={{
              native: true,
            }}
          >
            <option
              value=""
              style={{ backgroundColor: "gray", color: "white" }}
            >
              All
            </option>
            {usersWhoRented.map((user, index) => (
              <option
                key={index}
                value={user}
                style={{ backgroundColor: "gray", color: "white" }}
              >
                {user}
              </option>
            ))}
          </StyledAutocomplete>
        </div>

        <div className="col-span-1">
          <div className="relative w-full">
            <label className="text-white mb-2">Rented Until</label>
            <div className="relative">
              <input
                type="date"
                className="w-full filter-search-input pr-16"
                value={filterValues.rentedUntil || ""}
                onChange={(e) =>
                  setFilterValues((prev) => ({
                    ...prev,
                    rentedUntil: e.target.value,
                  }))
                }
              />
              {filterValues.rentedUntil && (
                <button
                  onClick={() =>
                    setFilterValues((prev) => ({ ...prev, rentedUntil: "" }))
                  }
                  className="absolute top-0 right-0 h-full bg-main-color-text-white px-3 py-1 rounded-r"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="w-full">
            <span className="text-white">Status</span>
            <select
              value={filterValues.availability}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  availability: e.target.value,
                }))
              }
              className="filter-search-input mt-1"
            >
              <option value="ALL">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfileFilterComponent;
