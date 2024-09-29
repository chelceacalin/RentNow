import { useState } from "react";
import RentMovieModalView from "./RentMovieModalView.jsx";
import RentedUntil from "./RentedUntil.jsx";
import ViewMovieDetailsModalWindow from "./ViewMovieDetailsModalWindow.jsx";
import "./css/RentedMovies.scss";

function RentedMovie({ book, triggerRefresh, setTriggerRefresh }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isRentModalOpen, setRentModalOpen] = useState(false);

  const handleDetailsOpen = () => setDetailsModalOpen(true);
  const handleDetailsClose = () => setDetailsModalOpen(false);
  const handleOpenRentModal = () => setRentModalOpen(true);
  const handleCloseRentModal = () => {
    setRentModalOpen(false);
    setTriggerRefresh((prev) => !prev);
  };
  return (
    <div
      className={`rented-book-card ${
        !book.isAvailable ? "unavailable" : "available"
      }`}
    >
      <img
        src={book.photoUrl || "/default-book.jpg"}
        alt={book.title}
        className="book-image"
      />
      <div className="book-info">
        <div className="book-details">
          <h2 className="book-title">{book.title}</h2>
          <p className="book-detail">Director: {book.director}</p>
          {!book.isAvailable && <RentedUntil book={book} />}
        </div>
        <div className="book-actions">
          <button className="details-button" onClick={handleDetailsOpen}>
            Details
          </button>
          <button
            className={`rent-button ${!book.isAvailable ? "disabled" : ""}`}
            onClick={handleOpenRentModal}
            disabled={!book.isAvailable}
          >
            Rent
          </button>
        </div>
      </div>
      {detailsModalOpen && (
        <ViewMovieDetailsModalWindow
          isModalOpen={detailsModalOpen}
          closeModal={handleDetailsClose}
          book={book}
        />
      )}
      {isRentModalOpen && (
        <RentMovieModalView
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

export default RentedMovie;
