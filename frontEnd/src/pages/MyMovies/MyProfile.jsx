import { Container } from "@mui/material";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import AddNewMovieModalWindow from "../../components/MyMovies/AddNewMovieModalWindow";
import Movie from "../../components/MyMovies/Movie";
import MyProfileFilterComponent from "../../components/MyMovies/MyProfileFilterComponent";
import MyProfileRedirectButtons from "../../components/MyMovies/MyProfileRedirectButtons";
import Pagination from "../../components/Pagination/Pagination";
import { UserLoginContext } from "../../utils/context/LoginProvider";

function MyProfile() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    director: "",
    title: "",
    isAvailable: "",
    rentedUntil: "",
    rentedBy: "",
    sortField: "title",
    direction: true,
  });

  const mapSortField = (field) => {
    switch (field) {
      case "status":
        return "isAvailable";
      case "renteduntil":
        return "rentedUntil";
      case "rentedby":
        return "rentedBy";
      default:
        return field;
    }
  };

  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 15,
    totalPages: 1,
  });
  const [initialized, setInitialized] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const { username } = useContext(UserLoginContext);

  const handleFilterInput = useCallback(
    (newFilters) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
      setPagination((prev) => ({
        ...prev,
        pageNo: 1,
      }));
    },
    [setFilters, setPagination]
  );

  const handleSortChange = useCallback(
    (field) => {
      const mappedField = mapSortField(field);
      setFilters((prev) => ({
        ...prev,
        sortField: mappedField,
        direction: prev.sortField === mappedField ? !prev.direction : true,
      }));
      setPagination((prev) => ({
        ...prev,
        pageNo: 1,
      }));
    },
    [setFilters, setPagination]
  );

  const handlePageChange = useCallback(
    (newPageNo) => {
      setPagination((prev) => ({
        ...prev,
        pageNo: newPageNo,
      }));
    },
    [setPagination]
  );

  const handlePageSizeChange = useCallback(
    (event) => {
      setPagination((prev) => ({
        ...prev,
        pageSize: parseInt(event.target.value, 10),
        pageNo: 1,
      }));
    },
    [setPagination]
  );

  useEffect(() => {
    const fetchMovies = async () => {
      const params = {
        owner_username: username,
        sortField: filters.sortField || "title",
        direction: filters.direction ? "ASC" : "DESC",
        title: filters.title,
        director: filters.director,
        category: filters.category,
        isAvailable: filters.isAvailable,
        pageNo: pagination.pageNo - 1,
        pageSize: pagination.pageSize,
      };

      if (filters.rentedUntil) {
        params.rentedUntil = filters.rentedUntil;
      }
      if (filters.rentedBy) {
        params.rentedBy = filters.rentedBy;
      }

      try {
        const response = await axios.get("/movies", { params });
        setMovies(response.data.content);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
        }));
        setInitialized(true);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setInitialized(true);
      }
    };

    fetchMovies();
  }, [filters, pagination.pageNo, pagination.pageSize, username]);

  return (
    <Container maxWidth="xl">
      <MyProfileFilterComponent onFilterChange={handleFilterInput} />
      <div className="flex items-center justify-start w-full mt-2">
        <MyProfileRedirectButtons />
        <button onClick={() => setOpenAddModal(true)} className="close-button">
          Add New
        </button>
        <AddNewMovieModalWindow
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onRefresh={() => {
            setFilters((prev) => ({ ...prev }));
          }}
        />
      </div>
      <div className="overflow-x-auto w-full mt-1">
        <table className="min-w-full text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              {[
                "Title",
                "Director",
                "Category",
                "Status",
                "Rented Until",
                "Rented By",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    handleSortChange(header.toLowerCase().replace(/\s+/g, ""))
                  }
                >
                  <div className="flex items-center">
                    {header}
                    {filters.sortField ===
                      header.toLowerCase().replace(/\s+/g, "") && (
                      <svg
                        className={`ml-1 w-4 h-4 transform ${
                          filters.direction ? "rotate-0" : "rotate-180"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.23 7.21a.75.75 0 011.06-.02L10 10.94l3.71-3.75a.75.75 0 011.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0l-4.25-4.3a.75.75 0 01.02-1.06z" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {movies.map((movie) => (
              <Movie
                key={movie.id}
                movie={movie}
                onRefresh={() => {
                  setFilters((prev) => ({ ...prev }));
                }}
              />
            ))}
          </tbody>
        </table>
        {!movies.length && initialized && (
          <div className="text-center py-4">No matching results found</div>
        )}
      </div>
      <Pagination
        pageNo={pagination.pageNo}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Container>
  );
}

export default MyProfile;
