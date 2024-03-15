import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import * as moreClasses from "react-dom/test-utils";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import DatePickerClear from "../DatePicker/DatePickerClear";
import "./css/MyProfileFilter.scss";
function MyProfileFilterComponent({ filterInput }) {
  let [title, setTitle] = useState("");
  let [director, setDirector] = useState("");
  let [category, setCategory] = useState("");
  let [available, setAvailable] = useState(true);
  let [unavailable, setUnavailable] = useState(true);
  let [rentedUntil, setRentedUntil] = useState(null);
  let [rentedBy, setRentedBy] = useState(null);
  let [url, setUrl] = useState("");
  let [usersWhoRented, setUsersWhoRented] = useState([]);
  let [filteredUsers, setFilteredUsers] = useState([]);
  let { username } = useContext(UserLoginContext);

  useEffect(() => {
    url = `/movies?owner_username=${username}`;
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
    const date = rentedUntil ? rentedUntil.format("YYYY-MM-DD").toString() : "";

    let array = [];
    if (
      (available == true && unavailable == true) ||
      (available == false && unavailable == false)
    ) {
      array.push(category, director, title, "BOTH", date, rentedBy);
    } else if (available == true && unavailable == false) {
      array.push(category, director, title, "true", date, rentedBy);
    } else if (available == false && unavailable == true) {
      array.push(category, director, title, "false", date, rentedBy);
    } else array.push(category, director, title, "", date, rentedBy);
    filterInput(array);
  }, [
    category,
    director,
    title,
    available,
    unavailable,
    rentedUntil,
    rentedBy,
  ]);

  return (
    <div className="flex flexContainer">
      <div className="filterContainer">
        <div className="">
          <TextField
            id="outlined-search"
            name="title"
            label="Search title"
            type="search"
            size="small"
            className="w-48"
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>
        <div className="">
          <TextField
            id="outlined-search"
            name="director"
            label="Search director"
            type="search"
            size="small"
            className="w-48"
            onChange={(e) => setDirector(e.target.value)}
            InputProps={{
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>
      </div>

      <div className="filterContainer">
        <div className="">
          <TextField
            id="outlined-search"
            name="category"
            label="Search category"
            type="search"
            size="small"
            className="w-48"
            onChange={(e) => setCategory(e.target.value)}
            InputProps={{
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>

        <div className="">
          <Autocomplete
            sx={{ fontFamily: "Sanchez" }}
            value={rentedBy}
            onChange={(e, value) => {
              setRentedBy(value);
            }}
            ListboxProps={{
              style: { fontFamily: "Sanchez" },
            }}
            options={filteredUsers.map((m) => m.rentedBy)}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{
                  style: { fontFamily: "Sanchez" },
                }}
                InputProps={{
                  ...params.InputProps,
                  ...moreClasses.input,
                  style: { fontFamily: "Sanchez" },
                }}
                sx={{ fontFamily: "Sanchez" }}
                size="small"
                label="Rented by"
              />
            )}
          />
        </div>
      </div>

      <div className="filterContainer">
        <div className="">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePickerClear
              labelString={"Rented until"}
              value={rentedUntil}
              onClear={() => setRentedUntil(null)}
              onChange={(newDate) => setRentedUntil(newDate)}
            />
          </LocalizationProvider>
        </div>

        <div className="flex">
          <div>
            <Checkbox
              name="type"
              label="Unavailable"
              defaultChecked
              size="small"
              onClick={(e) => {
                setUnavailable(e.target.checked);
              }}
            />
            <label name="unavailable">Unavailable</label>
          </div>
          <div>
            <Checkbox
              name="type"
              label="Available"
              defaultChecked
              size="small"
              onClick={(e) => {
                setAvailable(e.target.checked);
              }}
            />
            <label name="available">Available</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfileFilterComponent;
