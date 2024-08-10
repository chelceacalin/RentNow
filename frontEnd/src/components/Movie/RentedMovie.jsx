import { useState } from "react";
import RentMovieModalView from "./RentMovieModalView.jsx";
import RentedUntil from "./RentedUntil.jsx";
import ViewMovieDetailsModalWindow from "./ViewMovieDetailsModalWindow.jsx";
import "./css/RentedMovies.scss";

function RentedMovie({ movie, triggerRefresh, setTriggerRefresh }) {
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
      className={`rented-movie-card ${
        !movie.isAvailable ? "unavailable" : "available"
      }`}
    >
      <img
        src={movie.photoUrl || "/default-movie.jpg"}
        alt={movie.title}
        className="movie-image"
      />
      <div className="movie-info">
        <div className="movie-details">
          <h2 className="movie-title">{movie.title}</h2>
          <p className="movie-detail">Director: {movie.director}</p>
          {!movie.isAvailable && <RentedUntil movie={movie} />}
        </div>
        <div className="movie-actions">
          <button className="details-button" onClick={handleDetailsOpen}>
            Details
          </button>
          <button
            className={`rent-button ${!movie.isAvailable ? "disabled" : ""}`}
            onClick={handleOpenRentModal}
            disabled={!movie.isAvailable}
          >
            Rent
          </button>
        </div>
      </div>
      {detailsModalOpen && (
        <ViewMovieDetailsModalWindow
          isModalOpen={detailsModalOpen}
          closeModal={handleDetailsClose}
          movie={movie}
        />
      )}
      {isRentModalOpen && (
        <RentMovieModalView
          isRentModalOpen={isRentModalOpen}
          handleCloseRentModal={handleCloseRentModal}
          movie={movie}
          setTriggerRefresh={setTriggerRefresh}
          triggerRefresh={triggerRefresh}
        />
      )}
    </div>
  );
}

export default RentedMovie;
