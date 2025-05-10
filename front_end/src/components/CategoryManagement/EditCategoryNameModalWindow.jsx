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
    if (isModalOpen) {
      setNewName(name);
    }
  }, [name, isModalOpen]);

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
        const { data } = response;
        showSuccess("Category edited successfully!");
        updateCategory({
          id: data.id,
          name: data.name,
          created_date: data.created_date,
          updated_date: data.updated_date,
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
      <div className="w-full flex justify-between p-4 reverseColors">
        <div className="modal-text ms-2 reverseColors">Edit Category</div>
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faTimes}
          size="xl"
          onClick={closeModal}
        />
      </div>
      <DialogContent className="reverseColors">
        <div className="">
          <TextField
            className="w-full"
            id="outlined-read-only-input"
            label="Name"
            required
            value={newName}
            onInput={(e) => {
              handleInputChangeWithValidation(
                e,
                setNewName,
                setErrorMessage,
                startsWithUppercase,
                "Should start with an uppercase!",
                500
              );
            }}
            error={!!errorMessage}
            helperText={errorMessage}
            InputLabelProps={{ className: "text-white reverseColors" }}
            InputProps={{ className: "text-white reverseColors" }}
          />
        </div>
        <div className="w-full mt-5">
          <button
            className="details-button db-sm"
            onClick={() => {
              resetField(setErrorMessage, "");
              editCategoryName();
              closeModal();
            }}
            disabled={!!errorMessage || newName.length === 0}
          >
            Save
          </button>
          <button
            className="details-button details-button-red db-sm"
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
