import { useContext, useState } from "react";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import ViewBookDetailsModalWindow from "./Details/ViewBookDetailsModalWindow.jsx";
import RentBookModalView from "./RentBookModalView.jsx";
import RentedUntil from "./RentedUntil.jsx";
import "./css/RentedBooks.scss";
function RentedBook({ book, triggerRefresh, setTriggerRefresh, refreshData }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isRentModalOpen, setRentModalOpen] = useState(false);

  const handleDetailsOpen = () => setDetailsModalOpen(true);
  const handleDetailsClose = () => setDetailsModalOpen(false);
  const handleOpenRentModal = () => setRentModalOpen(true);
  const handleCloseRentModal = () => {
    setRentModalOpen(false);
    refreshData();
  };

  const { isAdmin } = useContext(UserLoginContext);

  const { isAvailable, photoUrl, title, director } = book;
  return (
    <div
      className={`rented-book-card ${
        !isAvailable ? "unavailable" : "available"
      }`}
    >
      <img
        src={photoUrl || "/default-book.jpg"}
        alt={title}
        className="book-image"
      />
      <div className="book-info">
        <div className="book-details">
          <h2 className="book-title">{title}</h2>
          <p className="book-detail">Director: {director}</p>
          {!isAvailable && <RentedUntil book={book} />}
        </div>
        <div className="book-actions">
          <button className="details-button" onClick={handleDetailsOpen}>
            Details
          </button>
          <button
            className={`rent-button ${!isAvailable ? "disabled" : ""}`}
            onClick={handleOpenRentModal}
            disabled={!isAvailable || isAdmin}
          >
            {isAdmin ? "Disabled" : "Rent"}
          </button>
        </div>
      </div>
      {detailsModalOpen && (
        <ViewBookDetailsModalWindow
          book={book}
          refreshData={refreshData}
          isModalOpen={detailsModalOpen}
          triggerRefresh={triggerRefresh}
          closeModal={handleDetailsClose}
          setTriggerRefresh={setTriggerRefresh}
        />
      )}
      {isRentModalOpen && (
        <RentBookModalView
          book={book}
          refreshData={refreshData}
          isRentModalOpen={isRentModalOpen}
          handleCloseRentModal={handleCloseRentModal}
        />
      )}
    </div>
  );
}

export default RentedBook;
