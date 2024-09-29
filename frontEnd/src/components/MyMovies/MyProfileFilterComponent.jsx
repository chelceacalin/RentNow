import { Button, TextField, styled } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { UserLoginContext } from "../../utils/context/LoginProvider";

const StyledAutocomplete = styled(TextField)(({ theme }) => ({
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
          .filter((movie) => movie.rentedBy && movie.rentedBy !== "available")
          .map((movie) => movie.rentedBy);
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
      rentedUntil: filterValues.rentedUntil
        ? filterValues.rentedUntil.format("YYYY-MM-DD")
        : "",
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
    <div className="p-6 bg-gray-900 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <input
            type="search"
            placeholder="Search title"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
            value={filterValues.title}
            onChange={handleInputChange("title")}
          />
        </div>

        <div className="col-span-1">
          <input
            type="search"
            placeholder="Search director"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
            value={filterValues.director}
            onChange={handleInputChange("director")}
          />
        </div>

        <div className="col-span-1">
          <input
            type="search"
            placeholder="Search category"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg"
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
            className="w-full p-3 bg-gray-800  text-white border border-gray-700 rounded-lg color-white"
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

        <div className="col-span-1 mt-6">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="relative w-full">
              <DatePicker
                label="Rented Until"
                className="bg-gray-300 w-full"
                value={filterValues.rentedUntil}
                onChange={(newDate) =>
                  setFilterValues((prev) => ({ ...prev, rentedUntil: newDate }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    className="bg-gray-800 text-white border border-gray-700 rounded-lg"
                  />
                )}
              />
              {filterValues.rentedUntil && (
                <Button
                  onClick={() =>
                    setFilterValues((prev) => ({ ...prev, rentedUntil: null }))
                  }
                  variant="contained"
                  size="small"
                  className="absolute top-2 right-2 left-4 bg-red-500 text-white"
                >
                  Reset
                </Button>
              )}
            </div>
          </LocalizationProvider>
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
              className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg mt-1"
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
