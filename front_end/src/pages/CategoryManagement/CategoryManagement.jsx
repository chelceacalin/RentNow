import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Category from "../../components/CategoryManagement/Category.jsx";
import CreateCategoryModalWindow from "../../components/CategoryManagement/CreateCategoryModalWIndow.jsx";
import FilterCategory from "../../components/CategoryManagement/FilterCategory";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { usePagination } from "../../utils/hooks/usePagination.jsx";
import NoMatchingResultsFound from "../NotFound/NoMatchingResultsFound.jsx";

function CategoryManagement() {
  const { pagination, handlePageChange, handlePageSizeChange, setTotalPages } =
    usePagination();

  const [categories, setCategories] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [name, setName] = useState("");
  const [direction, setDirection] = useState(true);
  const [lastClicked, setLastClicked] = useState("name");
  const [totalCategories, setTotalCategories] = useState(0);
  const [signalCall, setSignalCall] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get(`/category`).then((data) => {
      setTotalCategories(data.data.content.length);
      setCategories(data.data.content);
    });
  }, [totalCategories, signalCall]);

  const handleClick = (fieldName) => {
    setDirection((prevDirection) => !prevDirection);
    setLastClicked(fieldName);
  };

  useEffect(() => {
    const { pageNo, pageSize } = pagination;
    const queryUrl = `/category?direction=${direction ? "ASC" : "DESC"}${
      name ? `&name=${name}` : ""
    }&sortBy=${lastClicked || "name"}&pageNo=${
      pageNo - 1
    }&pageSize=${pageSize}`;
    axios
      .get(queryUrl)
      .then((response) => {
        const { content, totalPages } = response.data;
        setTotalPages(totalPages);
        if (!content.length && pageNo > 1) {
        } else {
          setCategories(content);
        }
        setInitialized(true);
      })
      .catch(() => setInitialized(true));
  }, [
    direction,
    name,
    pagination.pageSize,
    pagination.pageNo,
    lastClicked,
    signalCall,
  ]);

  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setErrorMessage("");
    setOpen(false);
  };

  const getFilterInput = (params) => setName(params[0]);

  const updateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  return (
    <Container maxWidth="xl">
      <FilterCategory filterInput={getFilterInput} />
      <div className="m-0">
        <button
          onClick={handleOpen}
          className="close-button reset-margin-left reset-width font-bold"
        >
          Add new category
        </button>
        <CreateCategoryModalWindow
          isModalOpen={open}
          closeModal={handleClose}
          setSignalCall={setSignalCall}
          signalCall={signalCall}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      </div>
      <div className="w-full py-1">
        <div className="w-full flex flex-col bg-white justify-between">
          <div className="overflow-y-auto">
            <table className="cater w-full text-left border-b-2">
              <thead className="sticky top-0 z-30 thead-style">
                <tr>
                  {["Category", "Created Date", "Updated Date", "Actions"].map(
                    (elem) => (
                      <th
                        key={elem}
                        className="table-th"
                        onClick={() =>
                          elem !== "Actions" &&
                          handleClick(
                            elem === "Category"
                              ? "name"
                              : elem === "Created Date"
                              ? "created_date"
                              : "updated_date"
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span>{elem}</span>
                          {elem !== "Actions" &&
                            lastClicked ===
                              (elem === "Category"
                                ? "name"
                                : elem === "Created Date"
                                ? "created_date"
                                : "updated_date") && (
                              <svg
                                className={`ml-1 w-4 h-4 transform ${
                                  direction ? "rotate-0" : "rotate-180"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.23 7.21a.75.75 0 011.06-.02L10 10.94l3.71-3.75a.75.75 0 011.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0l-4.25-4.3a.75.75 0 01.02-1.06z" />
                              </svg>
                            )}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="text-blue-marine">
                {categories.map((category, index) => (
                  <Category
                    key={category.id}
                    category={category}
                    classes={`p-4 ${
                      index === categories.length - 1 ? "" : "border-b-2"
                    }`}
                    updateCategory={updateCategory}
                    setSignalCall={setSignalCall}
                    signalCall={signalCall}
                    setErrorMessage={setErrorMessage}
                    errorMessage={errorMessage}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {!categories.length && initialized && <NoMatchingResultsFound />}
          <Pagination
            pageNo={pagination.pageNo}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </Container>
  );
}

export default CategoryManagement;
