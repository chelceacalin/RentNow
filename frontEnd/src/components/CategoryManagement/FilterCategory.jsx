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
  <div className="filter-category-container py-1 flex"> 
    <div className="">
      <TextField
        id="outlined-search-name"
        name="name"
        label="Search category name"
        type="search"
        className="search-field w-48"
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
