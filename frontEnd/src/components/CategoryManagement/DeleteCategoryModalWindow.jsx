import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogContent } from "@mui/material";
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
        showSuccess("Category deleted successfully!", "bg-green-500");
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
            showError("Cannot delete a category associated with a movie");
          }
        }
      });
  };

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
      open={isEditModalOpen}
      onClose={closeEditModal}
    >
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
              Are you sure you want to permanently remove &nbsp;
              <span className="font-bold">{name}</span>
              &nbsp; category ?
            </p>
            <div className="flex gap-x-2 mt-6">
              <div className="flex-1">
                <Button
                  className="contained-button w-full"
                  variant="contained"
                  onClick={deleteCategory}
                >
                  Yes
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  className="outlined-button w-full"
                  variant="outlined"
                  onClick={() => {
                    closeEditModal();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteCategoryModalWindow;
