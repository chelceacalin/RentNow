import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import  Pagination from '../../components/Pagination/Pagination';
import { UserLoginContext } from "../../utils/context/LoginProvider";
import SortIcon from "../../utils/icons/SortIcon.jsx"
import RentedMovie from "../../components/Movie/RentedMovie.jsx"
import MovieFilter from "../../components/Movie/MovieFilter.jsx"
import "./css/Movies.css"
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
    "",
    "",
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

  useEffect(() => {
    const buildUrl = () => {
      const normalizedSortField = sortField || "title";
      let params = [
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

      if(rentedDate){
        params.push(`rentedDate=${rentedDate}`)
      }

      if (rentedBy) {
        params.push(`rentedBy=${rentedBy}`);
      }

      return `/movies?${params.join("&")}`;
    };

    const url = buildUrl();
    axios.get(url).then((elems) => {
      if (elems.data.content.length === 0 && pageNo > 1) {
        updatePageNumber(pageNo - 1);
      } else {
        let moviesArray = elems.data.content;
        for (let movie of moviesArray){
          if (movie.isAvailable == true) {
            movie.rentedBy = "N/A";
            movie.rentedDate = "N/A";
            movie.rentedUntil = "N/A"
          }
        }
        setMovies(moviesArray);
        setTotalPages(elems.data.totalPages);
      }
      setInitialized(true);
    }).catch(error => {
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
    ownerUsername,
    pageSize,
    rentedDate,
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
    setRentedDate(params[6])
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
      <div className="filterContainer h-screen border-r-2">
        <MovieFilter filterInput={getFilterInput} />
      </div>
      <div className="bg-grey-texture w-full h-screen px-5 py-10  ">
        <div className="w-full h-full flex flex-col bg-white justify-between border-2 ">
          <div className="overflow-y-auto ">
            <table className="w-full min-w-max table-auto text-left border-b-2 ">
              <thead className="bg-basic-red sticky top-0 z-30 text-white">
                <tr className="bg-red-700">
                  {TABLE_HEAD.slice(0, TABLE_HEAD.length).map((elem) => {
                    return (
                      <th
                        key={elem}
                        className={`border-b-white p-4 ${
                          elem.length > 2 ? "hover" : ""
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
                          }
                          else if (e.target.textContent === "Rented On") {
                            setSortField("rentedDate");
                            setDirection(!direction);
                          }
                          else if (e.target.textContent === "Owner") {
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

                            let column=e.currentTarget.getAttribute("data-column");
                            if (column !== "Status") {
                              if (column === "Title") {
                                setSortField("title");
                              } else if (column === "Director") {
                                setSortField("director");
                              } else if (column=== "Category") {
                                setSortField("category");
                              }
                              if (
                                sortField === column.toLowerCase()
                              ) {
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
                              else if (column === "Rented On") {
                                setSortField("rentedDate");
                                setDirection(!direction);
                              }
                              else if (column === "Owner") {
                                setSortField("owner_username");
                                setDirection(!direction);
                              }
                            }
                          }}
                        >
                          {elem != "Status" && elem.length > 2 && <SortIcon />}
                        </svg>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-blue-marine bg-red">
              {
              movies.map(
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
                    owner_username
                  },
                  index
                ) => {
                  const isLast = index === movies.length - 1;
                  const classes = isLast
                    ? "px-2 py-2"
                    : "px-2 py-2 border-b border-blue-gray-50";

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
          </div>
          <div className="bg-red-700">
          { !movies.length && initialized && (<p className="text-center text-2xl">No matching results found</p> )}
          <div className="w-full bg-basic-red flex justify-between flex-wrap py-3 border-2">
            <div className=" inline-flex marginResizable">
              <p className="text-white font-normal ms-5">Results per page: </p>
              <p className="ml-5">
                <select
                  className="bg-basic-red cursor-pointer text-black font-bold border-2 p-1"
                  onChange={handleSelectChange}
                >
                  <option value="15">15</option>
                  <option value="10">10</option>
                  <option value="5">5</option>
                </select>
              </p>
            </div>
            <div className="justify-center items-center">
            { movies.length > 0 && (
              <Pagination
                pageNo={pageNo}
                pageSize={pageSize}
                totalPages={totalPages}
                updatePageNumber={updatePageNumber}
                responseLength={totalMovies}
                nrCurrentMovies={movies.length}
              />  )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Movies;
