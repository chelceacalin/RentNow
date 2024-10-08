import { Container } from "@mui/material";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import AddNewBookModalWindow from "../../components/MyBooks/AddNewBookModalWindow.jsx";
import Book from "../../components/MyBooks/Book.jsx";
import MyProfileFilterComponent from "../../components/MyBooks/MyProfileFilterComponent";
import MyProfileRedirectButtons from "../../components/MyBooks/MyProfileRedirectButtons";
import Pagination from "../../components/Pagination/Pagination";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import NoMatchingResultsFound from "../NotFound/NoMatchingResultsFound.jsx";
function MyProfile() {
  const [books, setBooks] = useState([]);
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
      case "createddate":
        return "created_date";
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
  const [lastClicked, setLastClicked] = useState("");

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
      setLastClicked(field);
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
    const fetchBooks = async () => {
      const params = {
        owner_username: username,
        sortField: filters.sortField || "title",
        direction: filters.direction ? "ASC" : "DESC",
        title: filters.title,
        director: filters.director,
        category: filters.category,
        isAvailable: filters.isAvailable,
        pageNo: pagination.pageNo - 1,
        created_date: filters.created_date,
        pageSize: pagination.pageSize,
      };

      if (filters.rentedUntil) {
        params.rentedUntil = filters.rentedUntil;
      }
      if (filters.rentedBy) {
        params.rentedBy = filters.rentedBy;
      }

      try {
        const response = await axios.get("/books", { params });
        setBooks(response.data.content);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
        }));
        setInitialized(true);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setInitialized(true);
      }
    };

    fetchBooks();
  }, [filters, pagination.pageNo, pagination.pageSize, username, lastClicked]);

  return (
    <Container maxWidth="xl">
      <MyProfileFilterComponent onFilterChange={handleFilterInput} />
      <div className="flex items-center justify-start w-full mt-2">
        <MyProfileRedirectButtons />
        <button onClick={() => setOpenAddModal(true)} className="close-button">
          Add New
        </button>
        <AddNewBookModalWindow
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onRefresh={() => {
            setFilters((prev) => ({ ...prev }));
          }}
        />
      </div>
      <div className="overflow-x-auto w-full mt-1">
        <table className="min-w-full text-left">
          <thead className="thead-style">
            <tr>
              {[
                "Title",
                "Director",
                "Category",
                "Status",
                "Rented Until",
                "Rented By",
                "Created Date",
                "Actions",
              ].map((elem) => (
                <th
                  key={elem}
                  className="table-th"
                  onClick={() =>
                    elem !== "Actions" &&
                    handleSortChange(elem.toLowerCase().replace(/\s+/g, ""))
                  }
                >
                  <div className="flex items-center">
                    {elem}
                    {elem !== "Actions" &&
                      lastClicked ===
                        elem.toLowerCase().replace(/\s+/g, "") && (
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
            {books.map((book, index) => (
              <Book
                key={book.id}
                book={book}
                onRefresh={() => {
                  setFilters((prev) => ({ ...prev }));
                }}
                classes={`p-4 ${
                  index === books.length - 1 ? "" : "border-b-2"
                }`}
              />
            ))}
          </tbody>
        </table>
        {!books.length && initialized && <NoMatchingResultsFound />}
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
