import { useState } from "react";
import DeleteMovieModalView from "./DeleteMovieModalView";
import DetailsMovieModalView from "./DetailsMovieModalView";

function Movie({ movie, onRefresh }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeDetailsModal = () => setDetailsModalOpen(false);
  return (
    <tr>
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
      <td className="p-4">
        <button
          onClick={() => setDetailsModalOpen(true)}
          className="px-4 py-2 mb-2 bg-blue-detail-text-white text-white rounded mr-2"
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
          className="px-4 py-2 bg-main-color-text-white rounded"
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
