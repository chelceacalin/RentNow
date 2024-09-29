import { useEffect, useState } from "react";

function FilterComponent({ filterInput }) {
  const [filterValues, setFilterValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    availability: "ALL",
  });

  useEffect(() => {
    const array = [
      filterValues.firstName,
      filterValues.lastName,
      filterValues.email,
      filterValues.availability,
    ];
    filterInput(array);
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
            placeholder="Search first name"
            type="search"
            className="filter-search-input"
            value={filterValues.firstName}
            onChange={handleInputChange("firstName")}
          />
        </div>
        <div className="col-span-1">
          <input
            placeholder="Search last name"
            type="search"
            className="filter-search-input"
            value={filterValues.lastName}
            onChange={handleInputChange("lastName")}
          />
        </div>
        <div className="col-span-1">
          <input
            placeholder="Search email"
            type="search"
            className="filter-search-input"
            value={filterValues.email}
            onChange={handleInputChange("email")}
          />
        </div>
        <div className="col-span-1">
          <span className="text-white">Status</span>
          <select
            value={filterValues.availability}
            onChange={(e) =>
              setFilterValues((prev) => ({
                ...prev,
                availability: e.target.value,
              }))
            }
            className="filter-search-input"
          >
            <option value="ALL">All</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterComponent;
