import { Checkbox, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./css/FilterComponent.scss"

function FilterComponent({ filterInput }) {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [admin, setAdmin] = useState(true);
  let [user, setUser] = useState(true);

  useEffect(() => {
    let array = [];
    if ((admin === true && user === true) || (admin === false && user === false)) {
      array.push(firstName, lastName, email, "BOTH");
    } else if (admin === true && user === false) {
      array.push(firstName, lastName, email, "ADMIN");
    } else if (admin === false && user === true) {
      array.push(firstName, lastName, email, "USER");
    } else array.push(firstName, lastName, email, "");
    filterInput(array);
  }, [firstName, lastName, email, admin, user]);

  return (
    <div className="filter-component-container">
      <div className="filter-fields  ">
        <TextField
          id="outlined-search-first-name"
          name="firstName"
          label="Search first name"
          type="search"
          className="search-field"
          size="small"
          onChange={(e) => setFirstName(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
        <TextField
          id="outlined-search-last-name"
          name="lastName"
          label="Search last name"
          type="search"
          className="search-field"
          size="small"
          onChange={(e) => setLastName(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
        <TextField
          id="outlined-search-email"
          name="email"
          label="Search email"
          type="search"
          className="search-field"
          size="small"
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
        <div className="status-checkbox">
          <Checkbox
            name="user"
            defaultChecked
            onClick={(e) => {
              setUser(e.target.checked);
            }}
          />
          <label htmlFor="user">User</label>
          <Checkbox
            name="admin"
            defaultChecked
            onClick={(e) => {
              setAdmin(e.target.checked);
            }}
          />
          <label htmlFor="admin">Admin</label>
        </div>
      </div>
    </div>
  );
  
}

export default FilterComponent;
