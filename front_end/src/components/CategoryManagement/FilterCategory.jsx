import { useEffect, useState } from "react";

function FilterCategory({ filterInput }) {
  let [name, setName] = useState("");

  useEffect(() => {
    let array = [];
    array.push(name);
    filterInput(array);
  }, [name]);

  return (
    <div className="filter-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <input
            id="outlined-search-name"
            name="name"
            placeholder="Search category name"
            type="search"
            className="filter-search-input"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterCategory;
