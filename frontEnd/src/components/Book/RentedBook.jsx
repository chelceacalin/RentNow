import { useState } from "react";
import RentBookModalView from "./RentBookModalView.jsx";
import RentedUntil from "./RentedUntil.jsx";
import ViewBookDetailsModalWindow from "./ViewBookDetailsModalWindow.jsx";
import "./css/RentedBooks.scss";

function RentedBook({ book, triggerRefresh, setTriggerRefresh }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isRentModalOpen, setRentModalOpen] = useState(false);

  const handleDetailsOpen = () => setDetailsModalOpen(true);
  const handleDetailsClose = () => setDetailsModalOpen(false);
  const handleOpenRentModal = () => setRentModalOpen(true);
  const handleCloseRentModal = () => {
    setRentModalOpen(false);
    setTriggerRefresh((prev) => !prev);
  };

  console.log("book", book);

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
            disabled={!isAvailable}
          >
            Rent
          </button>
        </div>
      </div>
      {detailsModalOpen && (
        <ViewBookDetailsModalWindow
          isModalOpen={detailsModalOpen}
          closeModal={handleDetailsClose}
          book={book}
        />
      )}
      {isRentModalOpen && (
        <RentBookModalView
          isRentModalOpen={isRentModalOpen}
          handleCloseRentModal={handleCloseRentModal}
          book={book}
          setTriggerRefresh={setTriggerRefresh}
          triggerRefresh={triggerRefresh}
        />
      )}
    </div>
  );
}

export default RentedBook;
