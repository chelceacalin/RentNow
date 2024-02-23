import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import MovieFilter from "../../components/Movie/MovieFilter.jsx";
import RentedMovie from "../../components/Movie/RentedMovie.jsx";
import Pagination from "../../components/Pagination/Pagination";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import SortIcon from "../../utils/icons/SortIcon.jsx";
import "./css/Movies.scss";
import "../../variables.scss";

function Movies() {
  const { username } = useContext(UserLoginContext);
  const [movies, setMovies] = useState([]);
  const [filterParams, setFilterParams] = useState({
    category: "",
    director: "",
    title: "",
    isAvailable: "",
    rentedUntil: "",
    rentedBy: "",
    rentedDate: "",
  });
  const [pageDetails, setPageDetails] = useState({
    pageNo: 1,
    pageSize: 15,
    totalPages: 0,
    totalMovies: 0,
  });
  const [sortParams, setSortParams] = useState({
    sortField: "title",
    direction: true,
  });
  const [initialized, setInitialized] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const fetchMovies = useCallback(() => {
    // Initialize URLSearchParams with only relevant and non-empty parameters
    const params = new URLSearchParams({
      ...(filterParams.title && { title: filterParams.title }),
      ...(filterParams.director && { director: filterParams.director }),
      ...(filterParams.category && { category: filterParams.category }),
      ...(filterParams.isAvailable !== "" && { isAvailable: filterParams.isAvailable }),
      ...(filterParams.rentedUntil && { rentedUntil: filterParams.rentedUntil }),
      ...(filterParams.rentedBy && { rentedBy: filterParams.rentedBy }),
      ...(filterParams.rentedDate && { rentedDate: filterParams.rentedDate }),
      sortField: sortParams.sortField,
      direction: sortParams.direction ? "ASC" : "DESC",
      pageNo: pageDetails.pageNo - 1,
      pageSize: pageDetails.pageSize,
    });
  
    const url = `/movies?${params.toString()}`;
    axios.get(url)
      .then((response) => {
        // Handle the response as before
        const { data } = response;
        setMovies(data.content);
        setPageDetails(prev => ({
          ...prev,
          totalPages: data.totalPages,
          totalMovies: data.totalElements,
        }));
        setInitialized(true);
      })
      .catch((error) => {
        console.error("Failed to fetch movies:", error);
        setInitialized(true);
      });
  }, [filterParams, pageDetails.pageNo, pageDetails.pageSize, sortParams]);
  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies, triggerRefresh]);

  const updateFilterParams = useCallback((newParams) => {
    setFilterParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const handleSelectChange = useCallback((event) => {
    const value = event.target.value;
    setPageDetails(prev => ({ ...prev, pageSize: value }));
  }, []);

  const updatePageNumber = useCallback((pgNo) => {
    setPageDetails(prev => ({ ...prev, pageNo: pgNo }));
  }, []);

  const handleSort = useCallback((field) => {
    setSortParams(prev => ({
      sortField: field,
      direction: prev.sortField === field ? !prev.direction : true,
    }));
  }, []);

  return (
    <div className="bg-grey-texture h-screen ">
      <div className="bg-basic-red rounded-lg shadow-lg">
        <MovieFilter filterInput={updateFilterParams} />
      </div>
      <div className="w-full h-full flex flex-col bg-white justify-between">
        <div className="overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left border-b-2">
              <thead className="bg-basic-red sticky z-30 text-white ">
                <tr className="simpleMainBg text-center">
                  {["Title", "Director", "Category", "Status", "Owner", "Rented On", "Rented Until", "Rented By",""].map((elem) => (
                    <th key={elem} className={`border-b-white p-4 ${elem.length > 2 ? "mainBg" : ""} cursor-pointer`}
                        onClick={() => handleSort(elem.toLowerCase())}>
                      {elem}
                      {elem !== "Status" && <SortIcon />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-blue-marine">
                {movies.map((movie, index) => (
                  <RentedMovie key={index} {...movie} triggerRefresh={setTriggerRefresh} />
                ))}
              </tbody>
            </table>
          </div>
          {!movies.length && initialized && (
            <p className="text-center text-2xl bg-white m-auto m-5 justify-center flex">No matching results found</p>
          )}
          <div className="shadow-lg simpleMainBg p-4  ">
            <div className="flex justify-between">
              <div className="flex items-center">
                <p className="text-white">Results per page:</p>
                <select className=" cursor-pointer text-black font-bold border-2 ms-4"
                        onChange={handleSelectChange} value={pageDetails.pageSize}>
                  <option value="15">15</option>
                  <option value="10">10</option>
                  <option value="5">5</option>
                </select>
                { (
                <Pagination
                  pageNo={pageDetails.pageNo}
                  pageSize={pageDetails.pageSize}
                  totalPages={pageDetails.totalPages}
                  updatePageNumber={updatePageNumber}
                  responseLength={pageDetails.totalMovies}
                  nrCurrentMovies={movies.length}
                />
              )}
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Movies;