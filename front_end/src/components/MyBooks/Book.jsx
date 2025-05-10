import { useState } from "react";
import DeleteBookModalView from "./DeleteBookModalView.jsx";
import DetailsBookModalView from "./DetailsBookModalView.jsx";
import CloneBookModalView from "./CloneBookModalView.jsx";

function Book({ book, onRefresh, classes }) {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const closeDetailsModal = () => setDetailsModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const closeCloneModal = () => setCloneModalOpen(false);
  return (
    <tr className="shadow-sm shadow-slate-300 reverseColors">
      <td className={classes}>{book.title} </td>
      <td className={classes}>{book.director}</td>
      <td className={classes}>{book.category}</td>
      <td
        className={`p-4 ${
          book.isAvailable
            ? "text-green-color font-bold"
            : "text-main-color  font-bold"
        }`}
      >
        {book.isAvailable ? "Available" : "Unavailable"}
      </td>
      <td className={classes}>{book.rentedDate || "N/A"}</td>
      <td className={classes}>{book.rentedUntil || "N/A"}</td>
      <td className={classes}>
        {book.rentedBy !== "available" ? book.rentedBy : ""}
      </td>
      <td className={classes}>{book.created_date}</td>
      <td className={classes}>
        <button
          onClick={() => setDetailsModalOpen(true)}
          className="details-button reset-width"
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
          onClick={() => setCloneModalOpen(true)}
          className="details-button rent-button reset-width"
        >
          Clone
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="details-button details-button-red reset-width"
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


        {cloneModalOpen && (
          <CloneBookModalView
            isModalOpen={cloneModalOpen}
            closeModal={closeCloneModal}
            book={book}
            onRefresh={onRefresh}
          />
        )}

      </td>
    </tr>
  );
}

export default Book;
