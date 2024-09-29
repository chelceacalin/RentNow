import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function DeleteBookModalView({
  isModalOpen,
  closeModal,
  title,
  category,
  id,
  rentedBy,
  setTriggerRefresh,
  triggerRefresh,
}) {
  const [requestError, setRequestError] = useState(false);

  const deleteBook = () => {
    let url = `/books/delete/${id}`;

    axios
      .post(url)
      .then(() => {
        setTriggerRefresh(!triggerRefresh);
        showSuccess("Book deleted successfully!", "bg-green-500");
        closeModal();
        setRequestError(false);
      })
      .catch((error) => {
        showError(error.response.data);
        closeModal();
      });
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth={"sm"}>
      <div className="overflow-x-hidden">
        <FontAwesomeIcon
          style={{ fontSize: 28 }}
          className="closeModalWindowButton mb-6"
          icon={faTimes}
          onClick={closeModal}
          transform="right-185 up-2"
          size="6x"
        />
        <DialogContent>
          <div className="w-full break-normal text-center mb-5">
            <p> Are you sure you want to delete this book?</p>
          </div>

          <div className="mt-2 mb-2 pl-5 pr-5">
            <Button
              className="contained-button w-full"
              variant="contained"
              onClick={deleteBook}
            >
              Yes
            </Button>
          </div>
          <div className="mb-2 pl-5 pr-5">
            <Button
              className="outlined-button w-full"
              variant="outlined"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteBookModalView;
