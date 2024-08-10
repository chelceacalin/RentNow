import { Container, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieFilter from "../../components/Movie/MovieFilter.jsx";
import RentedMovie from "../../components/Movie/RentedMovie.jsx";
import "../../components/ScrollToTop/ScrollToTopButton.jsx";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton.jsx";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [category, setCategory] = useState("");
  const [director, setDirector] = useState("");
  const [title, setTitle] = useState("");
  const [isAvailable, setIsAvailable] = useState("ALL");
  const [rentedBy, setRentedBy] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [direction, setDirection] = useState(true);
  const [sortField, setSortField] = useState("title");

  const navigate = useNavigate();

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

      return `/movies?${params.toString()}`;
    };

    const url = buildUrl();

    navigate(url.replace("/movies", ""), { replace: false });

    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setMovies(data.content);
        setInitialized(true);
      })
      .catch((error) => {
        console.error("Failed to fetch movies: ", error);
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
  ]);

  const getFilterInput = (params) => {
    setCategory(params[0]);
    setDirector(params[1]);
    setTitle(params[2]);
    setIsAvailable(params[3] === "ALL" ? "" : params[3]);
    setRentedBy(params[4]);
    setTriggerRefresh((prev) => !prev);
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
    setTriggerRefresh(!triggerRefresh);
  };

  const handleDirectionChange = (event) => {
    setDirection(event.target.value === "ASC");
    setTriggerRefresh(!triggerRefresh);
  };

  return (
    <Container maxWidth="xl">
      <ScrollToTopButton />
      <MovieFilter
        filterInput={getFilterInput}
        handleSortFieldChange={handleSortFieldChange}
        handleDirectionChange={handleDirectionChange}
        sortField={sortField}
        direction={direction}
      />
      <Grid container spacing={0} mt={0} className="rented-movies-container">
        {movies.map((movie, idx) => (
          <Grid item key={idx}>
            <RentedMovie
              movie={movie}
              id={movie.id}
              title={movie.title}
              category={movie.category}
              director={movie.director}
              isAvailable={movie.isAvailable}
              owner_username={movie.owner_username}
              rentedDate={movie.rentedDate}
              description={movie.description}
              triggerRefresh={triggerRefresh}
              setTriggerRefresh={setTriggerRefresh}
              photoUrl={movie.photoUrl}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Movies;
