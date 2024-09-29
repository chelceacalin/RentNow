import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import { showError, showSuccess } from "../../service/ToastService";

function DeleteCategoryModalWindow({
  isEditModalOpen,
  closeEditModal,
  name,
  id,
  setSignalCall,
  signalCall,
}) {
  const deleteCategory = () => {
    let url = "/category/delete/" + id;

    axios
      .post(url)
      .then(() => {
        showSuccess("Category deleted successfully!");
        setSignalCall(!signalCall);
        closeEditModal();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            const message = JSON.stringify(error.response.data)
              .replace('"', "")
              .replace('"', "");
            showError(message);
          } else if (error.response.status === 500) {
            showError("Cannot delete a category associated with a book");
          }
        }
      });
  };

  return (
    <Dialog maxWidth={"sm"} open={isEditModalOpen} onClose={closeEditModal}>
      <div className="overflow-x-hidden">
        <FontAwesomeIcon
          className="absolute top-4 right-4 cursor-pointer"
          icon={faTimes}
          size="xl"
          onClick={closeEditModal}
        />
        <DialogContent>
          <div className="break-normal text-center mt-10 text-xl">
            <p>
              {" "}
              Are you sure you want to permanently remove category &nbsp;
              <span className="font-bold text-red-800">{name}</span>?
            </p>
            <div className="flex  mt-6">
              <button className="details-button" onClick={deleteCategory}>
                Yes
              </button>
              <button
                className="details-button details-button-red"
                onClick={() => {
                  closeEditModal();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteCategoryModalWindow;
