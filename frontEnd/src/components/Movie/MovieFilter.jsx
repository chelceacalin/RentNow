import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import DatePickerClear from "../../components/DatePicker/DatePickerClear";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useDebouncedCallback } from "use-debounce";

function MovieFilter({ filterInput }) {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);
  const [unavailable, setUnavailable] = useState(true);
  const [rentedUntil, setRentedUntil] = useState(null);
  const [rentedDate, setRentedDate] = useState(null);
  const [rentedBy, setRentedBy] = useState(null);
  const [usersWhoRented, setUsersWhoRented] = useState([]);
  const { username } = useContext(UserLoginContext);
  let [filteredUsers, setFilteredUsers] = useState([]);
  let [url, setUrl] = useState("");

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
      category,
      director,
      title,
      availabilityFilter,
      rentedUntilField,
      rentedBy,
      rentedDateField,
    ];

    debouncedFilterInput(array);
  }, [
    category,
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
    <div className="flex flex-wrap items-start my-2 fContainer">
      <div className="filterContainer">
        <TextField
          id="outlined-search-title"
          name="title"
          label="Search title"
          type="search"
          className="text"
          size="small"
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{ style: { fontFamily: "Sanchez" } }}
          InputLabelProps={{ style: { fontFamily: "Sanchez" } }}
        />
        <TextField
          id="outlined-search-director"
          name="director"
          label="Search director"
          type="search"
          className="text"
          size="small"
          onChange={(e) => setDirector(e.target.value)}
          InputProps={{ style: { fontFamily: "Sanchez" } }}
          InputLabelProps={{ style: { fontFamily: "Sanchez" } }}
        />
      </div>
  
      <div className="filterContainer">
        <TextField
          id="outlined-search-category"
          name="category"
          label="Search category"
          type="search"
          size="small"
          className="text"
          onChange={(e) => setCategory(e.target.value)}
          InputProps={{ style: { fontFamily: "Sanchez" } }}
          InputLabelProps={{ style: { fontFamily: "Sanchez" } }}
        />
        <Autocomplete
          className="text"
          value={rentedBy}
          onChange={(e, value) => setRentedBy(value)}
          options={filteredUsers.map((m) => m.rentedBy)}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Rented by"
              InputProps={{
                ...params.InputProps,
                style: { fontFamily: "Sanchez" },
              }}
              InputLabelProps={{ style: { fontFamily: "Sanchez" } }}
            />
          )}
        />
      </div>
  
      <div className="filterContainer">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerClear
            className="text"
            value={rentedDate}
            size="small"
            labelString="Rented on"
            onClear={() => setRentedDate(null)}
            onChange={(newDate) => setRentedDate(newDate)}
          />
          <DatePickerClear
            className="text"
            value={rentedUntil}
            size="small"
            slotProps={{ textField: { size: 'small' } }}
            labelString="Rented until"
            onClear={() => setRentedUntil(null)}
            onChange={(newDate) => setRentedUntil(newDate)}
          />
        </LocalizationProvider>
      </div>
  
      <div className="filterContainer">
        <div className="availabilityContainer">
          <div className="ms-3">Status:</div>
          <div>
            <Checkbox
              name="type"
              size="small"
              label="Unavailable"
              defaultChecked
              onClick={(e) => setUnavailable(e.target.checked)}
            />
            <label>Unavailable</label>
          </div>
          <div>
            <Checkbox
              name="type"
              size="small"
              label="Available"
              defaultChecked
              onClick={(e) => setAvailable(e.target.checked)}
            />
            <label>Available</label>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default MovieFilter;
