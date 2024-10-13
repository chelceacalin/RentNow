import { Container, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import BookFilter from "../../components/Book/BookFilter.jsx";
import RentedBook from "../../components/Book/RentedBook.jsx";
import "../../components/ScrollToTop/ScrollToTopButton.jsx";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton.jsx";
import { useReviewsContext } from "../../utils/context/ReviewsContext.jsx";
import NoMatchingResultsFound from "../NotFound/NoMatchingResultsFound.jsx";
function Books() {
  const [books, setBooks] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [category, setCategory] = useState("");
  const [director, setDirector] = useState("");
  const [title, setTitle] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [rentedBy, setRentedBy] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [direction, setDirection] = useState(true);
  const [sortField, setSortField] = useState("title");
  const { refreshReviews, setrefreshReviews } = useReviewsContext();

  useEffect(() => {
    const buildUrl = () => {
      const params = new URLSearchParams({
        sortField: sortField || "title",
        direction: direction ? "ASC" : "DESC",
        title: title,
        director: director,
        category: category || "",
        isAvailable: isAvailable,
        pageNo: pageNo - 1,
        pageSize: pageSize,
      });

      if (rentedBy) {
        params.append("rentedBy", rentedBy);
      }

      return `/books/extended?${params.toString()}`;
    };

    const url = buildUrl();

    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setBooks(data.content);
        setInitialized(true);
      })
      .catch((error) => {
        console.error("Failed to fetch books: ", error);
        setInitialized(true);
      });
  }, [
    triggerRefresh,
    sortField,
    direction,
    title,
    director,
    category,
    isAvailable,
    rentedBy,
    refreshReviews,
  ]);

  const getFilterInput = (params) => {
    setCategory(params[0]);
    setDirector(params[1]);
    setTitle(params[2]);
    setIsAvailable(params[3] === "ALL" ? "" : params[3]);
    setRentedBy(params[4]);
    setTriggerRefresh((prev) => !prev);
  };

  const refreshData = () => {
    setTriggerRefresh((prev) => !prev);
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
    refreshData();
  };

  const handleDirectionChange = (event) => {
    setDirection((prevDirection) => !prevDirection);
    refreshData();
  };

  return (
    <Container maxWidth="xl">
      <ScrollToTopButton />
      <BookFilter
        filterInput={getFilterInput}
        handleSortFieldChange={handleSortFieldChange}
        handleDirectionChange={handleDirectionChange}
        sortField={sortField}
        direction={direction}
      />
      <Grid container spacing={0} mt={0} className="rented-books-container">
        {books.map((book, idx) => (
          <Grid item key={idx}>
            <RentedBook
              book={book}
              triggerRefresh={triggerRefresh}
              setTriggerRefresh={setTriggerRefresh}
              refreshData={refreshData}
            />
          </Grid>
        ))}
        {books.length === 0 && <NoMatchingResultsFound />}
      </Grid>
    </Container>
  );
}

export default Books;
