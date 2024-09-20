import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";
import {
  handleInputChangeWithValidation,
  resetField,
  startsWithUppercase,
} from "../../service/UtilService";

function EditCategoryNameModalWindow({
  isModalOpen,
  closeModal,
  id,
  name,
  updateCategory,
}) {
  const [newName, setNewName] = useState(name);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const editCategoryName = () => {
    let url = "/category/update/" + id;

    if (newName.charAt(0) !== newName.charAt(0).toUpperCase()) {
      showError("Name should start with an uppercase letter!");
      return;
    }

    if (newName.length < 2) {
      showError("Name should have at least 2 characters!");
      return;
    }

    axios
      .post(url, {
        id: id,
        name: newName,
      })
      .then((response) => {
        showSuccess("Category edited successfully!", "bg-green-500");
        updateCategory({
          id: response.data.id,
          name: response.data.name,
        });
        closeModal();
      })
      .catch((error) => {
        if (error.response) {
          const message = JSON.stringify(error.response.data)
            .replace('"', "")
            .replace('"', "");
          showError(message);
        }
      });
  };

  return (
    <Dialog maxWidth={"sm"} open={isModalOpen} onClose={closeModal}>
      <div className="w-full flex justify-between p-4">
        <div className="modal-text ms-2">Edit Category</div>
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faTimes}
          size="xl"
          onClick={closeModal}
        />
      </div>
      <DialogContent>
        <div>
          <TextField
            className="w-full"
            id="outlined-read-only-input"
            label="Name"
            required
            value={newName}
            onChange={(e) => {
              handleInputChangeWithValidation(
                e,
                setNewName,
                setErrorMessage,
                startsWithUppercase,
                "Should start with an uppercase!",
                250
              );
            }}
            error={!!errorMessage}
            helperText={errorMessage}
          />
        </div>
        <div className="flex justify-end gap-x-4 mt-6">
          <button
            className="details-button"
            onClick={() => {
              resetField(setErrorMessage, "");
              editCategoryName();
            }}
            disabled={!!errorMessage}
          >
            Save
          </button>
          <button
            className="details-button details-button-red"
            onClick={() => {
              resetField(setErrorMessage, "");
              closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategoryNameModalWindow;
