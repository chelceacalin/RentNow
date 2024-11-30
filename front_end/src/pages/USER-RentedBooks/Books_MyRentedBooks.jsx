import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import MyProfileRedirectButtons from "../../components/MyBooks/MyProfileRedirectButtons.jsx";
import MyRentedBooks from "../../components/MyRentedBooks/MyRentedBooks.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import { useFetchData } from "../../utils/hooks/useFetchData.jsx";
import { usePagination } from "../../utils/hooks/usePagination.jsx";
import NoMatchingResultsFound from "../NotFound/NoMatchingResultsFound.jsx";
function Books_MyRentedBooks() {
  const TABLE_HEAD = [
    "Title",
    "Director",
    "Category",
    "Rented On",
    "Rented Until",
    "Owner",
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
      `rentEmail=${email || ""}`,
      `rentedUntil=${rentedUntil}`,
      `rentedDate=${rentedDate}`,
      `owner_username=${ownerUsername}`,
      `rentedBy=${rentedBy}`,
    ].filter(Boolean);

    return `/books/rented?${params.join("&")}`;
  };

  const { data: uBooks, loaded } = useFetchData(buildUrl());

  useEffect(() => {
    if (loaded) {
      const { content, totalPages } = uBooks || {};
      setBooks(content || []);
      setTotalPages(totalPages || 1);
    }
  }, [uBooks, loaded]);

  const { data } = useFetchData(`/bookHistory/count/${email}`);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} className="mt-4">
        {data &&
          Object.entries(data).map(([status, count]) => (
            <Grid item xs={4} sm={4} md={2} key={status}>
              <Card>
                <CardContent>
                  <Typography variant="h8" color="textSecondary" gutterBottom>
                    {status.replace(/_/g, " ")}
                  </Typography>
                  <Typography variant="h4">{count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <div className="bg-grey-texture w-full mt-8">
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
                    key={book.id + "-" + book.bookHistoryId}
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
            {!books.length && initialized && <NoMatchingResultsFound />}
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

export default Books_MyRentedBooks;
