import axios from "axios";
import { useEffect, useState } from "react";
import MovieFilter from "../../components/Movie/MovieFilter.jsx";
import RentedMovie from "../../components/Movie/RentedMovie.jsx";
import Pagination from "../../components/Pagination/Pagination";
import "../../variables.scss";
import "./css/Movies.scss";
import "../../components/ScrollToTop/ScrollToTopButton.jsx";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton.jsx";
function Movies() {
  const [movies, setMovies] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [category, setCategory] = useState("");
  const [director, setDirector] = useState("");
  const [title, setTitle] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [rentedUntil, setRentedUntil] = useState("");
  const [rentedBy, setRentedBy] = useState("");
  const [rentedDate, setRentedDate] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [direction, setDirection] = useState(true);
  const [sortField, setSortField] = useState("title");

  useEffect(() => {
    const buildUrl = () => {
      const params = new URLSearchParams({
        sortField: sortField || "title",
        direction: direction ? "ASC" : "DESC",
        title: title,
        director: director,
        category: category != null ? category : "",
        isAvailable: isAvailable,
        pageNo: pageNo - 1,
        pageSize: pageSize,
      });

      if (rentedUntil) params.append("rentedUntil", rentedUntil);
      if (rentedDate) params.append("rentedDate", rentedDate);
      if (rentedBy) params.append("rentedBy", rentedBy);

      console.log(`/movies?${params.toString()}`);
      return `/movies?${params.toString()}`;
    };

    const url = buildUrl();
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        if (data.content.length === 0 && pageNo > 1) {
          updatePageNumber(pageNo - 1);
        } else {
          setMovies(data.content);
          setTotalPages(data.totalPages);
        }
        setInitialized(true);
      })
      .catch((error) => {
        console.error("Failed to fetch movies:", error);
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
    rentedUntil,
    rentedDate,
    rentedBy,
    pageSize,
    pageNo,
  ]);

  let getFilterInput = (params) => {
    setCategory(params[0]);
    setDirector(params[1]);
    setTitle(params[2]);
    setIsAvailable(params[3] === "BOTH" ? "" : params[3]);
    setRentedUntil(params[4]);
    setRentedBy(params[5]);
    setRentedDate(params[6]);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setPageSize(value);
  };

  const updatePageNumber = (pgNo) => {
    setPageNo(pgNo);
  };

  return (
    <>
      <div className="w-screen">
        <ScrollToTopButton />
        <MovieFilter filterInput={getFilterInput} />
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          totalPages={totalPages}
          updatePageNumber={updatePageNumber}
          handleSelectChange={handleSelectChange}
        />
        {!movies.length && initialized && (
          <div className="text-center">No matching results found</div>
        )}
        <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start ">
          {movies.map((movie, idx) => (
            <RentedMovie
              movie={movie}
              id={movie.id}
              title={movie.title}
              category={movie.category}
              director={movie.director}
              isAvailable={movie.isAvailable}
              rentedUntil={movie.rentedUntil}
              owner_username={movie.owner_username}
              rentedDate={movie.rentedDate}
              rentedBy={movie.rentedBy}
              description={movie.description}
              triggerRefresh={triggerRefresh}
              setTriggerRefresh={setTriggerRefresh}
              photoUrl={movie.photoUrl}
              key={idx}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Movies;
