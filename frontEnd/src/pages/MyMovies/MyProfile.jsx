import axios from "axios";
import {useContext, useEffect, useState} from "react";
import AddNewMovieModalWindow from "../../components/MyMovies/AddNewMovieModalWindow";
import Movie from "../../components/MyMovies/Movie";
import MyProfileFilterComponent from "../../components/MyMovies/MyProfileFilterComponent";
import MyProfileRiredirectButtons from "../../components/MyMovies/MyProfileRiredirectButtons";
import Pagination from "../../components/Pagination/Pagination";
import {UserLoginContext} from "../../utils/context/LoginProvider";
import SortIcon from "../../utils/icons/SortIcon";

function MyProfile() {
  const TABLE_HEAD = [
    "Title",
    "Director",
    "Category",
    "Status",
    "Rented Until",
    "Rented By",
    "Actions",
    "",
  ];
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [director, setDirector] = useState("");
  const [title, setTitle] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [rentedUntil, setRentedUntil] = useState("");
  const [rentedBy, setRentedBy] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [sortField, setSortField] = useState("title");
  const [direction, setDirection] = useState(true);
  const [lastClicked, setLastClicked] = useState(null);
  const [newUrl, setNewUrl] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState("");
  const [totalMovies, setTotalMovies] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { username } = useContext(UserLoginContext);
  let handleClick = (fieldName) => {
    if (lastClicked === fieldName) {
      setDirection(!direction);
    }
    setLastClicked(fieldName);
  };

  useEffect(() => {
    const buildUrl = () => {
      const normalizedSortField = sortField || "title";
      let params = [
        `owner_username=${username}`,
        `sortField=${normalizedSortField}`,
        `direction=${direction ? "ASC" : "DESC"}`,
        `title=${title}`,
        `director=${director}`,
        `category=${category}`,
        `isAvailable=${isAvailable}`,
        `pageNo=${parseInt(pageNo) - 1}`,
        `pageSize=${pageSize}`,
      ];

      if (rentedUntil) {
        params.push(`rentedUntil=${rentedUntil}`);
      }

      if (rentedBy) {
        params.push(`rentedBy=${rentedBy}`);
      }

      return `/movies?${params.join("&")}`;
    };

    const url = buildUrl();

    axios
      .get(url)
      .then((elems) => {
        if (elems.data.content.length === 0 && pageNo > 1) {
          updatePageNumber(pageNo - 1);
        } else {
          setMovies(elems.data.content);
          setTotalPages(elems.data.totalPages);
        }
        setInitialized(true);
      })
      .catch((error) => {
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
    rentedBy,
    ownerUsername,
    pageSize,
    pageNo,
    movies.length,
  ]);

  let getFilterInput = (params) => {
    setCategory(params[0]);
    setDirector(params[1]);
    setTitle(params[2]);
    setIsAvailable(params[3] === "BOTH" ? "" : params[3]);
    setRentedUntil(params[4]);
    setRentedBy(params[5]);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setPageSize(value);
  };

  const updatePageNumber = (pgNo) => {
    setPageNo(pgNo);
  };

  const addMovie = (addedMovie) => {
    const addedMovies = movies.map((movie) => {
      if (movie.title === addedMovie.title) {
        return addedMovie;
      }
      return movie;
    });
    setMovies(updatedMovie);
  };

  return (
    <>
      <div className="px-10 w-full">
        <div className="my-4">
          <MyProfileFilterComponent filterInput={getFilterInput} />
        </div>
        <div className="flex items-center justify-start w-full">
          <MyProfileRiredirectButtons />
          <button
            onClick={handleOpen}
            className="text-white flex justify-center ms-1 mainBg  p-4"
          >
            Add New
          </button>
          <AddNewMovieModalWindow
            isModalOpen={open}
            closeModal={handleClose}
            title={title}
            director={director}
            category={category}
            addMovie={addMovie}
            triggerRefresh={triggerRefresh}
            setTriggerRefresh={setTriggerRefresh}
          />
        </div>
        <div className="flex flex-col bg-white justify-between w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-30  text-white">
                <tr>
                  {TABLE_HEAD.slice(0, TABLE_HEAD.length - 1).map((elem) => (
                    <th
                      key={elem}
                      className={`border-b-white p-4 ${
                        elem.length > 2 ? "mainBg" : ""
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.preventDefault();

                        if (e.target.textContent !== "Status") {
                          if (e.target.textContent === "Title") {
                            setSortField("title");
                            setDirection(!direction);
                          } else if (e.target.textContent === "Director") {
                            if (
                              title.length > 0 ||
                              director.length > 0 ||
                              category.length > 0
                            ) {
                              setDirection(!direction);
                            }
                            setSortField("director");
                            handleClick(e.target.textContent.toLowerCase());
                          } else if (e.target.textContent === "Category") {
                            if (
                              title.length > 0 ||
                              director.length > 0 ||
                              category.length > 0
                            )
                              setDirection(!direction);
                            setSortField("category");
                            handleClick(e.target.textContent.toLowerCase());
                          } else if (e.target.textContent === "Rented Until") {
                            if (
                              title.length > 0 ||
                              director.length > 0 ||
                              category.length > 0
                            ) {
                              setDirection(!direction);
                            }
                            setSortField("rentedUntil");
                            handleClick(e.target.textContent.toLowerCase());
                          } else if (e.target.textContent === "Rented By") {
                            if (
                              title.length > 0 ||
                              director.length > 0 ||
                              category.length > 0
                            ) {
                              setDirection(!direction);
                            }
                            setSortField("rentedBy");
                            handleClick(e.target.textContent.toLowerCase());
                          }
                        }
                      }}
                    >
                      <div>
                        {elem}
                        {elem !== "Status" && (
                          <svg
                            data-column={elem}
                            style={{ display: "inline-block" }}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => {
                              setDirection(!direction);
                              let column =
                                e.currentTarget.getAttribute("data-column");
                              handleClick(column.toLowerCase());

                              e.stopPropagation();

                              if (column !== "Status") {
                                if (column === "Title") {
                                  setSortField("title");
                                } else if (column === "Director") {
                                  setSortField("director");
                                } else if (column === "Category") {
                                  setSortField("category");
                                }
                                if (sortField === column.toLowerCase()) {
                                  setDirection(!direction);
                                } else {
                                  setDirection(true);
                                }

                                if (column === "Rented Until") {
                                  setSortField("rentedUntil");
                                  setDirection(!direction);
                                } else if (column === "Rented By") {
                                  setSortField("rentedBy");
                                  setDirection(!direction);
                                }
                              }
                            }}
                          >
                            <SortIcon />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="border-b-white p-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="text-blue-marine">
                {movies.map((movie, index) => (
                  <Movie
                      key={index}
                    {...movie}
                    classes={
                      index === movies.length - 1
                        ? "px-4 py-2"
                        : "px-4 py-2 border-b border-blue-gray-50"
                    }
                    triggerRefresh={triggerRefresh}
                    setTriggerRefresh={setTriggerRefresh}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="simpleMainBg w-auto me-7">
            {!movies.length && initialized && (
              <p className="text-center text-2xl notFoundText bg-white p-2 m-auto justify-center flex">
                No matching results found
              </p>
            )}
            <div className="shadow-lg globalBg p-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <p className="text-white">Results per page:</p>
                  <select
                    className="bg-basic-red cursor-pointer text-black font-bold border-2 ms-4"
                    onChange={handleSelectChange}
                  >
                    <option value="15">15</option>
                    <option value="10">10</option>
                    <option value="5">5</option>
                  </select>
                </div>
                {movies.length > 0 && (
                  <Pagination
                    pageNo={pageNo}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    updatePageNumber={updatePageNumber}
                    responseLength={totalMovies}
                    nrCurrentMovies={movies.length}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
