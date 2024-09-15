import { Container } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import MyProfileRedirectButtons from "../../components/MyMovies/MyProfileRedirectButtons";
import Movie_MyRentedMovies from "../../components/MyRentedMovies/Movie_MyRentedMovies";
import Pagination from "../../components/Pagination/Pagination";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import SortIcon from "../../utils/icons/SortIcon";

function MyRentedMovies() {
  const TABLE_HEAD = [
    "Title",
    "Director",
    "Category",
    "Rented On",
    "Rented Until",
    "Owner",
    "",
  ];
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("");
  const [director, setDirector] = useState("");
  const [title, setTitle] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [rentedDate, setRendedDate] = useState("");
  const [rentedUntil, setRentedUntil] = useState("");
  const [rentedBy, setRentedBy] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [movieOwner, setMovieOwner] = useState("");
  const [sortField, setSortField] = useState("title");
  const [direction, setDirection] = useState(true);
  const [lastClicked, setLastClicked] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState("");
  const [totalMovies, setTotalMovies] = useState(0);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { email } = useContext(UserLoginContext);

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
        `sortField=${normalizedSortField}`,
        `direction=${direction ? "ASC" : "DESC"}`,
        `title=${title}`,
        `director=${director}`,
        `category=${category}`,
        `pageNo=${parseInt(pageNo) - 1}`,
        `pageSize=${pageSize}`,
      ];

      if (email) {
        params.push(`rentEmail=${email}`);
      }

      if (rentedUntil) {
        params.push(`rentedUntil=${rentedUntil}`);
      }

      if (movieOwner) {
        params.push(`owner_username=${movieOwner}`);
      }

      if (rentedUntil) {
        params.push(`rentedDate=${rentedDate}`);
      }

      if (rentedBy) {
        params.push(`rentedBy=${ownerUsername}`);
      }

      return `/movies/rented?${params.join("&")}`;
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
      .catch(() => {
        setInitialized(true);
      });
  }, [
    triggerRefresh,
    sortField,
    direction,
    title,
    director,
    category,
    rentedUntil,
    rentedDate,
    rentedBy,
    ownerUsername,
    pageSize,
    pageNo,
    movies.length,
  ]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setPageSize(value);
  };

  const updatePageNumber = (pgNo) => {
    setPageNo(pgNo);
  };

  return (
    <Container maxWidth="xl">
      <div className="bg-grey-texture w-full mt-20">
        <MyProfileRedirectButtons />
        <div className="w-full flex flex-col bg-white justify-between border-2">
          <div className="overflow-y-auto">
            <table className="w-full min-w-max border-b-2 table-auto text-left">
              <thead className="bg-basic-red sticky top-0 z-30  bg-gray-800 text-white">
                <tr>
                  {TABLE_HEAD.slice(0, TABLE_HEAD.length - 1).map((elem) => {
                    return (
                      <th
                        key={elem}
                        className="border-b-white p-4 hover cursor-pointer mainBg"
                        onClick={(e) => {
                          e.preventDefault();

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
                          } else if (e.target.textContent === "Rented On") {
                            if (
                              title.length > 0 ||
                              director.length > 0 ||
                              category.length > 0
                            ) {
                              setDirection(!direction);
                            }
                            setSortField("rentedDate");
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
                          } else if (e.target.textContent === "Owner") {
                            if (
                              title.length > 0 ||
                              director.length > 0 ||
                              category.length > 0
                            ) {
                              setDirection(!direction);
                            }
                            setSortField("owner_username");
                            handleClick(e.target.textContent.toLowerCase());
                          }
                        }}
                      >
                        <div className="">
                          {elem}
                          <svg
                            data-column={elem}
                            style={{ display: "inline-block" }}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDirection(!direction);

                              let column =
                                e.currentTarget.getAttribute("data-column");
                              handleClick(column.toLowerCase());

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
                              } else if (column === "Rented On") {
                                setSortField("rentedDate");
                                setDirection(!direction);
                              } else if (column === "Owner") {
                                setSortField("owner_username");
                                setDirection(!direction);
                              }
                            }}
                          >
                            {<SortIcon />}
                          </svg>
                        </div>
                      </th>
                    );
                  })}
                  <th className="border-b-white mainBg p-4 ">
                    <div>Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-blue-marine">
                {movies.map(
                  (
                    {
                      title,
                      director,
                      category,
                      rentedDate,
                      rentedUntil,
                      rentedBy,
                      owner_username,
                      id,
                      isAvailable,
                    },
                    index
                  ) => {
                    const isLast = index === movies.length - 1;
                    const classes = isLast
                      ? "px-4 py-2"
                      : "px-4 py-2 border-b border-blue-gray-50";
                    return (
                      <Movie_MyRentedMovies
                        id={id}
                        title={title}
                        category={category}
                        director={director}
                        rentedUntil={rentedUntil}
                        rentedDate={rentedDate}
                        rentedBy={rentedBy}
                        owner={owner_username}
                        isAvailableForRenting={isAvailable}
                        key={index}
                        classes={classes}
                        triggerRefresh={triggerRefresh}
                        setTriggerRefresh={setTriggerRefresh}
                      />
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="simpleMainBg w-auto">
            {!movies.length && initialized && (
              <p className="text-center text-2xl notFoundText bg-white p-2 m-auto justify-center flex">
                No matching results found
              </p>
            )}
            {movies.length > 0 && (
              <Pagination
                pageNo={pageNo}
                pageSize={pageSize}
                totalPages={totalPages}
                updatePageNumber={updatePageNumber}
                responseLength={totalMovies}
                nrCurrentMovies={movies.length}
                handleSelectChange={handleSelectChange}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default MyRentedMovies;
