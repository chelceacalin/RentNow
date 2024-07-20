import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePickerClear from "../../components/DatePicker/DatePickerClear";
import { useDebouncedCallback } from "use-debounce";

function MovieFilter({ filterInput }) {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [available, setAvailable] = useState(true);
  const [unavailable, setUnavailable] = useState(true);
  const [rentedUntil, setRentedUntil] = useState(null);
  const [rentedDate, setRentedDate] = useState(null);
  const [rentedBy, setRentedBy] = useState(null);
  const [usersWhoRented, setUsersWhoRented] = useState([]);
  let [filteredUsers, setFilteredUsers] = useState([]);
  let [url, setUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    url = `/movies`;
    axios.get(url).then((elems) => {
      setUsersWhoRented(elems.data.content);
      const filteredElems = elems.data.content.filter(
        (elem) => elem.rentedBy !== "available"
      );
      const arrayUniqueByKey = [
        ...new Map(filteredElems.map((item) => [item.rentedBy, item])).values(),
      ];
      setFilteredUsers(arrayUniqueByKey);
    });
  }, [url]);

  useEffect(() => {
    axios.get("/category").then((elems) => {
      setCategories(elems.data.content.map((item) => item.name));
    });
  }, []);

  useDebouncedCallback((array) => {
    filterInput(array);
  }, 500);

  const debouncedFilterInput = useDebouncedCallback((array) => {
    filterInput(array);
  }, 500);

  useEffect(() => {
    const rentedUntilField = rentedUntil ? convertDate(rentedUntil) : "";
    const rentedDateField = rentedDate ? convertDate(rentedDate) : "";

    let availabilityFilter;
    if (available && unavailable) {
      availabilityFilter = "BOTH";
    } else if (available) {
      availabilityFilter = "true";
    } else if (unavailable) {
      availabilityFilter = "false";
    } else {
      availabilityFilter = "BOTH";
    }

    const array = [
      selectedCategory,
      director,
      title,
      availabilityFilter,
      rentedUntilField,
      rentedBy,
      rentedDateField,
    ];

    debouncedFilterInput(array);
  }, [
    selectedCategory,
    director,
    title,
    available,
    unavailable,
    rentedUntil,
    rentedBy,
    rentedDate,
  ]);

  let convertDate = (input) => {
    const inputDate = new Date(input);
    const year = inputDate.getFullYear();
    const month = ("0" + (inputDate.getMonth() + 1)).slice(-2);
    const day = ("0" + inputDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="movie-filter-container ">
      <div className="filter-section">
        <TextField
          id="outlined-search-title"
          name="title"
          label="Search title"
          type="search"
          fullWidth="true"
          variant="filled"
          size="small"
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="outlined-search-director"
          name="director"
          label="Search director"
          type="search"
          variant="filled"
          size="small"
          onChange={(e) => setDirector(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <div className="filter-section">
          <Autocomplete
            value={selectedCategory}
            onChange={(_, newValue) => {
              setSelectedCategory(newValue);
            }}
            options={categories}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                size="small"
                label="Category"
              />
            )}
          />
        </div>

        <Autocomplete
          value={rentedBy}
          onChange={(e, value) => setRentedBy(value)}
          options={filteredUsers.map((m) => m.rentedBy)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              size="small"
              label="Rented by"
            />
          )}
        />
      </div>

      <div className="filter-section">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerClear
            value={rentedDate}
            variant="filled"
            labelString="Rented on"
            className="filterDatepicker"
            onClear={() => setRentedDate(null)}
            onChange={(newDate) => setRentedDate(newDate)}
          />
        </LocalizationProvider>
      </div>
      
      <div className="filter-section">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerClear
            value={rentedUntil}
            variant="filled"
            className="filterDatepicker"
            labelString="Rented until"
            onClear={() => setRentedUntil(null)}
            onChange={(newDate) => setRentedUntil(newDate)}
          />
        </LocalizationProvider>
      </div>

      <div className="filter-section">
        <div className="status-section">
          <Checkbox
            name="type"
            size="small"
            defaultChecked
            onClick={(e) => setUnavailable(e.target.checked)}
          />
          <label>Unavailable</label>
          <Checkbox
            name="type"
            size="small"
            defaultChecked
            onClick={(e) => setAvailable(e.target.checked)}
          />
          <label>Available</label>
        </div>
      </div>
    </div>
  );
}

export default MovieFilter;
