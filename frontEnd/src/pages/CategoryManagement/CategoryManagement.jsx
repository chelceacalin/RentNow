import axios from "axios";
import { useEffect, useState } from "react";
import Category from "../../components/CategoryManagement/Category.jsx";
import CreateCategoryModalWindow from "../../components/CategoryManagement/CreateCategoryModalWIndow.jsx";
import FilterCategory from "../../components/CategoryManagement/FilterCategory";
import Pagination from "../../components/Pagination/Pagination.jsx";
import SortIcon from "../../utils/icons/SortIcon.jsx";

function CategoryManagement() {
  const TABLE_HEAD = ["Category", "Actions", ""];
  let [categories, setCategories] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [name, setName] = useState("");
  const [direction, setDirection] = useState(true);
  const [lastClicked, setLastClicked] = useState(null);
  let [newUrl, setNewUrl] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState("");
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

  let handleClick = (fieldName) => {
    if (lastClicked === fieldName) {
      setDirection(!direction);
    }
    setLastClicked(fieldName);
  };

  useEffect(() => {
    newUrl = `/category?direction=${direction ? "ASC" : "DESC"}${
      name.length > 0 ? `&name=${name}` : ""
    }&pageNo=${parseInt(pageNo) - 1}&pageSize=${pageSize}`;
    axios
      .get(newUrl)
      .then((elems) => {
        if (elems.data.content.length === 0 && pageNo > 1) {
          updatePageNumber(pageNo - 1);
        } else {
          setCategories(elems.data.content);
          setTotalPages(elems.data.totalPages);
        }
        setInitialized(true);
      })
      .catch(() => {
        setInitialized(true);
      });
    console.log(newUrl);
  }, [direction, name, pageSize, pageNo]);

  const updatePageNumber = (pgNo) => {
    setPageNo(pgNo);
  };

  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setErrorMessage("");
    setOpen(false);
  };

  const getFilterInput = (params) => {
    setName(params[0]);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setPageSize(value);
  };

  const updateCategory = (updatedCategory) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === updatedCategory.id) {
        return updatedCategory;
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  return (
    <div className="w-screen">
      <div className="flex">
          <FilterCategory filterInput={getFilterInput} />
      </div>
      <div className="mt-4">
          <button
            onClick={handleOpen}
            className="text-white flex justify-center mainBg  p-4"
          >
            Add new
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
        <div className="w-full  flex flex-col bg-white justify-between">
          <div className="overflow-y-auto ">
            <table className="cater w-full text-left  border-b-2">
              <thead className=" sticky top-0 z-30 text-white mainBg">
                <tr>
                  {TABLE_HEAD.slice(0, TABLE_HEAD.length - 1).map((elem) => {
                    return (
                      <th
                        key={elem}
                        className={`border-b-white p-4 ${
                          elem !== "Actions" ? "hover" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (e.target.textContent === "Category") {
                            setDirection(!direction);
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
                              const columnName =
                                e.currentTarget.getAttribute("data-column");
                              handleClick(columnName.toLowerCase());
                            }}
                          >
                            {elem !== "Actions" && <SortIcon />}
                          </svg>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="text-blue-marine">
                {categories.map(({ name, id }, index) => {
                  const isLast = index === categories.length - 1;
                  const classes = isLast ? "px-4 py-2" : "px-4 py-2 border-b-2";

                  return (
                    <Category
                      id={id}
                      name={name}
                      classes={classes}
                      updateCategory={updateCategory}
                      key={name}
                      setSignalCall={setSignalCall}
                      signalCall={signalCall}
                      setErrorMessage={setErrorMessage}
                      errorMessage={errorMessage}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="w-full">
            {!categories.length && initialized && (
              <p className="text-center text-2xl notFoundText bg-white p-4  justify-center flex align-center">
                No matching results found
              </p>
            )}

              <Pagination
                pageNo={pageNo}
                pageSize={pageSize}
                totalPages={totalPages}
                updatePageNumber={updatePageNumber}
                responseLength={totalCategories}
                nrCurrentUsers={categories.length}
                handleSelectChange={handleSelectChange}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;
