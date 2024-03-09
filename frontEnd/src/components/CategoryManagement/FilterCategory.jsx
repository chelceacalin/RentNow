import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

function FilterCategory({ filterInput }) {
  let [name, setName] = useState("");

  useEffect(() => {
    let array = [];
    array.push(name);
    filterInput(array);
  }, [name]);

  return (
    <div className="py-1 flex">
      <div className="mt-9">
        <TextField
          id="outlined-search"
          name="name"
          label="Search name"
          type="search"
          className="w-48"
          onChange={(e) => setName(e.target.value)}
          InputLabelProps={{
            style: { fontFamily: "Sanchez" },
          }}
        />
      </div>
    </div>
  );
}

export default FilterCategory;
