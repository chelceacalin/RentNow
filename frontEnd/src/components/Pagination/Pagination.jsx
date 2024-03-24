import "../../variables.scss";

function Pagination({
  pageNo,
  totalPages,
  updatePageNumber,
  handleSelectChange,
}) {
  let getPreviousPage = () => {
    if (pageNo > 1) updatePageNumber(--pageNo);
  };

  let getNextPage = () => {
    if (pageNo < totalPages) updatePageNumber(++pageNo);
  };

  const handlePageClick = (pageNumber) => {
    updatePageNumber(pageNumber);
  };

  return (
    <div className="bg-red-600  p-2 flex justify-between items-center">
      <div className="flex items-center">
        <p className="text-white mr-2">Results per page:</p>
        <select
          className="bg-basic-red cursor-pointer text-black font-bold border-2"
          onChange={handleSelectChange}
        >
          <option value="15">15</option>
          <option value="10">10</option>
          <option value="5">5</option>
        </select>
      </div>

      <ul className="list-style-none flex items-center justify-center cursor-pointer">
        <li
          onClick={(e) => {
            e.preventDefault();
            getPreviousPage();
          }}
        >
          <div className="relative block rounded bg-transparent px-3 transition-all duration-300 text-white mainBg p-2 me-2">
            Previous
          </div>
        </li>

        {totalPages <= 7 &&
          Array(totalPages)
            .fill()
            .map((_, index) => (
              <li
                key={index}
                onClick={() => handlePageClick(parseInt(index) + 1)}
              >
                <div
                  className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-smtransition-all duration-300 text-white hover:bg-neutral-300 ${
                    index + 1 === pageNo ? "current-page" : ""
                  }`}
                >
                  {index + 1}
                </div>
              </li>
            ))}

        {totalPages >= 8 && (
          <>
            {Array(3)
              .fill()
              .map((_, index) => (
                <li
                  key={index}
                  onClick={() => handlePageClick(parseInt(index) + 1)}
                >
                  <div
                    className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm  transition-all duration-300 text-white hover:bg-neutral-300 ${
                      index + 1 === pageNo ? "current-page" : ""
                    }`}
                  >
                    {" "}
                    {index + 1}{" "}
                  </div>
                </li>
              ))}

            {pageNo <= 3 ? (
              <div
                className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm  transition-all duration-300 text-white  hover:bg-neutral-300`}
              >
                {"..."}
              </div>
            ) : null}

            {pageNo > 3 && pageNo < totalPages - 2 && (
              <>
                {pageNo > 4 ? (
                  <div
                    className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm transition-all duration-300 text-white hover:bg-neutral-300`}
                  >
                    {"..."}
                  </div>
                ) : null}

                <li
                  key={pageNo}
                  onClick={() => handlePageClick(parseInt(pageNo))}
                >
                  <div
                    className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm  transition-all duration-300 text-white hover:bg-neutral-300 ${
                      pageNo > 3 && pageNo < totalPages - 2
                        ? "current-page"
                        : ""
                    }`}
                  >
                    {pageNo}{" "}
                  </div>
                </li>

                {pageNo < totalPages - 3 ? (
                  <div
                    className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm  transition-all duration-300 text-white hover:bg-neutral-300`}
                  >
                    {"..."}
                  </div>
                ) : null}
              </>
            )}

            {pageNo >= totalPages - 2 ? (
              <div
                className={` ml-0.5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm  transition-all duration-300 text-white hover:bg-neutral-300`}
              >
                {"..."}
              </div>
            ) : null}

            {Array(3)
              .fill()
              .map((_, index) => (
                <li
                  key={totalPages - 3 + index}
                  onClick={(e) =>
                    handlePageClick(totalPages - 3 + parseInt(index) + 1)
                  }
                >
                  <div
                    className={` ml-0.  5 mr-0.5 relative block rounded bg-transparent px-3 py-1 text-sm transition-all duration-300 text-white hover:bg-neutral-300 ${
                      totalPages - 3 + index + 1 === pageNo
                        ? "current-page"
                        : ""
                    }`}
                  >
                    {totalPages - 3 + index + 1}
                  </div>
                </li>
              ))}
          </>
        )}

        <li
          onClick={(e) => {
            e.preventDefault();
            getNextPage();
          }}
        >
          <div className="relative block rounded bg-transparent px-3  text-sm  transition-all duration-300 text-white mainBg p-2 ms-2">
            Next
          </div>
        </li>
      </ul>

      <style>
        {`
        .current-page {
          background-color: white;
          color: black;
        }
      `}
      </style>
    </div>
  );
}

export default Pagination;
