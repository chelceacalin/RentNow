import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MovieFilter from "../../components/Movie/MovieFilter.jsx";
import RentedMovie from "../../components/Movie/RentedMovie.jsx";
import Pagination from "../../components/Pagination/Pagination";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import SortIcon from "../../utils/icons/SortIcon.jsx";
import "./css/Movies.scss";
import "../../variables.scss"
function Movies() {
  const TABLE_HEAD = [
    "Title",
    "Director",
    "Category",
    "Status",
    "Owner",
    "Rented On",
    "Rented Until",
    "Rented By",
    "Actions",
  ];
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
  const [totalMovies, setTotalMovies] = useState(0);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { username } = useContext(UserLoginContext);
  const [direction, setDirection] = useState(true);
  const [sortField, setSortField] = useState("title");
  const [ownerUsername, setOwnerUsername] = useState("");
  let moviesArray = [];
  useEffect(() => {
    const buildUrl = () => {
      const params = new URLSearchParams({
        sortField: sortField || "title",
        direction: direction ? "ASC" : "DESC",
        title: title,
        director: director,
        category: category,
        isAvailable: isAvailable,
        pageNo: pageNo - 1,
        pageSize: pageSize,
      });
  
      if (rentedUntil) params.append("rentedUntil", rentedUntil);
      if (rentedDate) params.append("rentedDate", rentedDate);
      if (rentedBy) params.append("rentedBy", rentedBy);
  
      let builtURL=`/movies?${params.toString()}`;
      return builtURL;
    };
  
    const url = buildUrl();
    axios.get(url)
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
  }, [triggerRefresh, sortField, direction, title, director, category, isAvailable, rentedUntil, rentedDate, rentedBy, pageSize, pageNo]);
  

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
      <div className="bg-grey-texture w-auto  ">
        <div className="">
          <MovieFilter filterInput={getFilterInput} />
        </div>
        <div className="w-full h-full flex flex-col bg-white justify-between">
          <div className="overflow-y-auto">
          <table className="w-full min-w-max table-auto text-left border-b-2 ">
              <thead className=" sticky z-30 text-white ">
                <tr className="simpleMainBg text-center">
                  {TABLE_HEAD.slice(0, TABLE_HEAD.length).map((elem) => {
                    return (
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
                            } else if (e.target.textContent === "Director") {
                              setSortField("director");
                            } else if (e.target.textContent === "Category") {
                              setSortField("category");
                            }
                            if (
                              sortField === e.target.textContent.toLowerCase()
                            ) {
                              setDirection(!direction);
                            } else {
                              setDirection(true);
                            }

                            if (e.target.textContent === "Rented Until") {
                              setSortField("rentedUntil");
                              setDirection(!direction);
                            } else if (e.target.textContent === "Rented By") {
                              setSortField("rentedBy");
                              setDirection(!direction);
                            } else if (e.target.textContent === "Rented On") {
                              setSortField("rentedDate");
                              setDirection(!direction);
                            } else if (e.target.textContent === "Owner") {
                              setSortField("owner_username");
                              setDirection(!direction);
                            }
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
                                } else if (column === "Rented On") {
                                  setSortField("rentedDate");
                                  setDirection(!direction);
                                } else if (column === "Owner") {
                                  setSortField("owner_username");
                                  setDirection(!direction);
                                }
                              }
                            }}
                          >
                            {elem != "Status" && elem.length > 2 && (
                              <SortIcon />
                            )}
                          </svg>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="text-blue-marine ">
                {movies.map(
                  (
                    {
                      category,
                      director,
                      description,
                      title,
                      isAvailable,
                      rentedUntil,
                      rentedBy,
                      id,
                      rentedDate,
                      owner_username,
                    },
                    index
                  ) => {
                    const isLast = index === movies.length - 1;
                    const classes = isLast
                      ? "px-2 py-2 justify-center text-center"
                      : "px-2 py-2 border-b border-blue-gray-50  justify-center text-center";

                    return (
                      <RentedMovie
                        id={id}
                        title={title}
                        category={category}
                        director={director}
                        isAvailable={isAvailable}
                        rentedUntil={rentedUntil}
                        owner_username={owner_username}
                        rentedDate={rentedDate}
                        rentedBy={rentedBy}
                        key={index}
                        description={description}
                        classes={classes}
                        triggerRefresh={triggerRefresh}
                        setTriggerRefresh={setTriggerRefresh}
                      />
                    );
                  }
                )}
              </tbody>
            </table>

            <div className=" simpleMainBg">
              {!movies.length && initialized && (
                <p className="text-center text-2xl notFoundText bg-white p-4 m-auto justify-center flex">
                  No matching results found
                </p>
              )}
              <div className="shadow-lg globalBg p-4">
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
      </div>
    </>
  );
}

export default Movies;
