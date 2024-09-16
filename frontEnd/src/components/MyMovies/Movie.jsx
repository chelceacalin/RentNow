import { useState } from "react";
import DeleteMovieModalView from "./DeleteMovieModalView";
import DetailsMovieModalView from "./DetailsMovieModalView";

function Movie({ movie, onRefresh }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeDetailsModal = () => setDetailsModalOpen(false);
  return (
    <tr className="shadow-sm shadow-slate-300">
      <td className="p-4">{movie.title} </td>
      <td className="p-4">{movie.director}</td>
      <td className="p-4">{movie.category}</td>
      <td
        className={`p-4 ${
          movie.isAvailable ? "text-green-color" : "text-main-color"
        }`}
      >
        {movie.isAvailable ? "Available" : "Unavailable"}
      </td>

      <td className="p-4">{movie.rentedUntil || "N/A"}</td>
      <td className="p-4">
        {movie.rentedBy !== "available" ? movie.rentedBy : ""}
      </td>
      <td className="p-4">{movie.created_date}</td>
      <td className="pt-1">
        <button
          onClick={() => setDetailsModalOpen(true)}
          className="p-0 m-0 details-button db-sm text-white rounded mr-2"
        >
          Details
        </button>
        {detailsModalOpen && (
          <DetailsMovieModalView
            isModalOpen={detailsModalOpen}
            closeModal={closeDetailsModal}
            movie={movie}
            onRefresh={onRefresh}
          />
        )}
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="p-0 m-0 details-button details-button-red db-sm  rounded"
          disabled={!movie.isAvailable}
        >
          Delete
        </button>
        {deleteModalOpen && (
          <DeleteMovieModalView
            isModalOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            movieId={movie.id}
            onRefresh={onRefresh}
          />
        )}
      </td>
    </tr>
  );
}

export default Movie;
