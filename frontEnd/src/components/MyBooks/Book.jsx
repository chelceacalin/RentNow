import { useState } from "react";
import DeleteBookModalView from "./DeleteBookModalView.jsx";
import DetailsBookModalView from "./DetailsBookModalView.jsx";

function Book({ book, onRefresh }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeDetailsModal = () => setDetailsModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  return (
    <tr className="shadow-sm shadow-slate-300">
      <td className="p-4">{book.title} </td>
      <td className="p-4">{book.director}</td>
      <td className="p-4">{book.category}</td>
      <td
        className={`p-4 ${
          book.isAvailable
            ? "text-green-color font-bold"
            : "text-main-color  font-bold"
        }`}
      >
        {book.isAvailable ? "Available" : "Unavailable"}
      </td>

      <td className="p-4">{book.rentedUntil || "N/A"}</td>
      <td className="p-4">
        {book.rentedBy !== "available" ? book.rentedBy : ""}
      </td>
      <td className="p-4">{book.created_date}</td>
      <td className="pt-1">
        <button
          onClick={() => setDetailsModalOpen(true)}
          className="details-button db-sm"
        >
          Details
        </button>
        {detailsModalOpen && (
          <DetailsBookModalView
            isModalOpen={detailsModalOpen}
            closeModal={closeDetailsModal}
            book={book}
            onRefresh={onRefresh}
          />
        )}
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="details-button details-button-red db-sm"
          disabled={!book.isAvailable}
        >
          Delete
        </button>
        {deleteModalOpen && (
          <DeleteBookModalView
            isModalOpen={deleteModalOpen}
            closeModal={closeDeleteModal}
            book={book}
            onRefresh={onRefresh}
          />
        )}
      </td>
    </tr>
  );
}

export default Book;
