import { Checkbox, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function FilterComponent({ filterInput }) {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [admin, setAdmin] = useState(true);
  let [user, setUser] = useState(true);

  useEffect(() => {
    let array = [];
    if ((admin == true && user == true) || (admin == false && user == false)) {
      array.push(firstName, lastName, email, "BOTH");
    } else if (admin == true && user == false) {
      array.push(firstName, lastName, email, "ADMIN");
    } else if (admin == false && user == true) {
      array.push(firstName, lastName, email, "USER");
    } else array.push(firstName, lastName, email, "");
    filterInput(array);
  }, [firstName, lastName, email, admin, user]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4 mt-10">
        <TextField
          id="outlined-search"
          name="firstName"
          label="Search first name"
          type="search"
          className="w-48"
          size="small"
          onChange={(e) => setFirstName(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
        <TextField
          id="outlined-search"
          name="lastName"
          label="Search last name"
          type="search"
          className="w-48"
          size="small"
          onChange={(e) => setLastName(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
        <TextField
          id="outlined-search"
          name="email"
          label="Search email"
          type="search"
          className="w-48"
          size="small"
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            name="type"
            label="User"
            defaultChecked
            onClick={(e) => {
              setUser(e.target.checked);
            }}
          />
          <label name="user">User</label>
          <Checkbox
            name="type"
            label="Admin"
            defaultChecked
            onClick={(e) => {
              setAdmin(e.target.checked);
            }}
          />
          <label name="admin">Admin</label>
        </div>
      </div>
      <div className="w-full mt-2"></div>
    </div>
  );
}

export default FilterComponent;
