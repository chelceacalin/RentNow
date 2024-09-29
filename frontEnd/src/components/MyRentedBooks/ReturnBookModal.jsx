import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { showError, showSuccess } from "../../service/ToastService";

axios.defaults.withCredentials = true;

function ReturnBookModal({
  isModalOpen,
  closeModal,
  title,
  id,
  setTriggerRefresh,
  triggerRefresh,
  owner
}) {
  const updateBookStatus = () => {
    let url = `/books/updateStatus/${id}`;

    axios
      .post(url)
      .then(() => {
        showSuccess(`The book ${title} has been returned!`);
        setTriggerRefresh(!triggerRefresh);
        closeModal();
      })
      .catch((error) => {
        showError(error);
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
            <p> Please note that you need to return the book to the owner! ( {owner} )</p>
          </div>

          <div className="flex gap-x-2">
            <div className="flex-1">
              <Button
                className="contained-button w-full"
                variant="contained"
                onClick={updateBookStatus}
              >
                Ok
              </Button>
            </div>
            <div className="flex-1">
              <Button
                className="outlined-button w-full"
                variant="outlined"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ReturnBookModal;
