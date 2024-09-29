import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import { showError, showSuccess } from "../../service/ToastService";

function DeleteBookModalView({ isModalOpen, book, onRefresh, closeModal }) {
  const { id, title } = book;

  const deleteBook = () => {
    let url = `/books/delete/${id}`;

    axios
      .post(url)
      .then(() => {
        showSuccess("Book deleted successfully!");
        onRefresh();
        closeModal();
      })
      .catch((error) => {
        showError(error.response?.data || "Failed to delete the book.");
      });
  };

  console.log(isModalOpen);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth={"sm"}>
      <div className="header-container">
        <FontAwesomeIcon
          className="absolute top-4 right-4 cursor-pointer"
          icon={faTimes}
          size="xl"
          onClick={closeModal}
        />
        <DialogContent>
          <div className="w-full break-normal text-center font-bold mb-5 mt-8">
            <p>
              Are you sure you want to permanently remove book&nbsp;
              <span className="font-bold text-red-800">{title}</span>?
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={deleteBook} className="details-button">
              Yes
            </button>
            <button
              onClick={() => {
                onRefresh();
                closeModal();
              }}
              className="rent-button"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteBookModalView;
