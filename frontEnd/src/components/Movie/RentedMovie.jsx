import {
  Button,
  Card,
  Typography,
} from "@mui/material";
import { useState } from "react";
import RentMovieModalView from "./RentMovieModalView.jsx";
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

  const status = movie.isAvailable ? "Available" : "Unavailable";

  return (
    <Card className="rented-movie-card">
      <div className="image-container">
        <img
          src={movie.photoUrl || "/default-movie.jpg"}
          alt={movie.title}
          className="img-card"
        />
      </div>
      <div className="card-content">
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2">Director: {movie.director}</Typography>
        <Typography variant="body2"
          className={` ${!movie.isAvailable ? 'disabledButtonText' : ''}`}
        >Status: {status}</Typography>
        {!movie.isAvailable && (
          <>
            <Typography variant="body2">
              Rented on: {movie.rentedDate}
            </Typography>
            <Typography variant="body2">
              Rented until: {movie.rentedUntil}
            </Typography>
            <Typography variant="body2">
              Owner: {movie.owner_username}
            </Typography>
          </>
        )}
      </div>
      <div className="card-actions">
        <Button
          variant="contained"
          onClick={handleDetailsOpen}
          className="darkButton btnC"
        >
          Details
        </Button>

        <Button
          variant="contained"
          onClick={handleOpenRentModal}
          disabled={!movie.isAvailable}
          className={`redButton ${!movie.isAvailable ? 'disabledButton' : ''}`}
        >
          Rent
        </Button>
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
    </Card>
  );
}

export default RentedMovie;
