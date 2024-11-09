import { Container } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import MyProfileRedirectButtons from "../../components/MyBooks/MyProfileRedirectButtons.jsx";
import MyRentedBooks from "../../components/MyRentedBooks/MyRentedBooks.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import { usePagination } from "../../utils/hooks/usePagination.jsx";
function Books_PendingBooks() {
  const TABLE_HEAD = [
    "Title",
    "Director",
    "Category",
    "Rented On",
    "Rented Until",
    "Renter Email",
    "Status",
    "Actions",
  ];

  const { pagination, handlePageChange, handlePageSizeChange, setTotalPages } =
    usePagination();

  const [books, setBooks] = useState([]);
  const [filterParams, setFilterParams] = useState({
    category: "",
    director: "",
    title: "",
    rentedDate: "",
    rentedUntil: "",
    ownerUsername: "",
    rentedBy: "",
  });

  const [initialized, setInitialized] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { email, isAdmin } = useContext(UserLoginContext);
  const [direction, setDirection] = useState(false);
  const [sortField, setSortField] = useState("rentedDate");
  const [lastClicked, setLastClicked] = useState(null);

  const handleClick = (fieldName) => {
    setDirection((prevDirection) => !prevDirection);
    setLastClicked(fieldName);
    setSortField(mapFieldName(fieldName));
  };

  const mapFieldName = (field) => {
    switch (field) {
      case "rented on":
        return "rentedDate";
      case "rented until":
        return "rentedUntil";
      case "owner":
        return "owner_username";
      default:
        return field;
    }
  };
  const buildUrl = () => {
    const {
      category,
      director,
      title,
      rentedDate,
      rentedUntil,
      ownerUsername,
      rentedBy,
    } = filterParams;
    const params = [
      `sortField=${sortField}`,
      `direction=${direction ? "ASC" : "DESC"}`,
      `title=${title}`,
      `director=${director}`,
      `category=${category}`,
      `pageNo=${pagination.pageNo - 1}`,
      `pageSize=${pagination.pageSize}`,
      `rentedUntil=${rentedUntil}`,
      `rentedDate=${rentedDate}`,
      `owner_username=${ownerUsername}`,
      `rentedBy=${rentedBy}`,
    ].filter(Boolean);

    return `/books/rented?${params.join("&")}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = buildUrl();
        const response = await axios.get(url);
        const { content, totalPages } = response.data;
        setTotalPages(totalPages);
        setBooks(content.filter((b) => b.status === "PENDING"));
        setInitialized(true);
      } catch {
        setInitialized(true);
      }
    };

    fetchBooks();
  }, [
    triggerRefresh,
    filterParams,
    pagination.pageNo,
    pagination.pageSize,
    sortField,
    direction,
  ]);

  return (
    <Container maxWidth="xl">
      <div className="bg-grey-texture w-full mt-20">
        {isAdmin && <MyProfileRedirectButtons />}
        <div className="w-full flex flex-col bg-white justify-between border-2">
          <div className="overflow-y-auto">
            <table className="w-full min-w-max border-b-2 table-auto text-left">
              <thead className="sticky top-0 z-30 thead-style">
                <tr>
                  {TABLE_HEAD.map((elem) => (
                    <th
                      key={elem}
                      className="table-th"
                      onClick={(_) => {
                        if (elem !== "Actions") {
                          handleClick(elem.toLowerCase());
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <span>{elem}</span>
                        {elem !== "Actions" &&
                          lastClicked === elem.toLowerCase() && (
                            <svg
                              className={`ml-1 w-4 h-4 transform ${
                                direction ? "rotate-0" : "rotate-180"
                              }`}
                              fill="white"
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
              <tbody className="text-blue-marine">
                {books.map((book, index) => (
                  <MyRentedBooks
                    key={book.id}
                    book={book}
                    triggerRefresh={triggerRefresh}
                    setTriggerRefresh={setTriggerRefresh}
                    classes={
                      index === books.length - 1
                        ? "px-4 py-2"
                        : "px-4 py-2 border-b border-blue-gray-50"
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-auto">
            {!books.length && initialized && (
              <p className="text-center text-2xl notFoundText bg-white p-2 m-auto justify-center flex">
                No matching results found
              </p>
            )}
            {books.length > 0 && (
              <Pagination
                pageNo={pagination.pageNo}
                pageSize={pagination.pageSize}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Books_PendingBooks;
