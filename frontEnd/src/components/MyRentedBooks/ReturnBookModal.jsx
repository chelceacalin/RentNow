import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
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
  owner,
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
      <DialogContent>
        <FontAwesomeIcon
          className="closeModalWindowButton"
          icon={faTimes}
          onClick={closeModal}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            fontSize: "24px",
          }}
        />
        <div className="w-full break-normal text-center mb-5 mt-10">
          <p>
            Please note that you need to return the book to
            <span className="font-bold text-red-800"> {owner.username}</span>
          </p>
        </div>

        <div className="w-full mt-5">
          <button className="details-button db-sm" onClick={updateBookStatus}>
            Save
          </button>
          <button
            className="details-button details-button-red db-sm"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReturnBookModal;
