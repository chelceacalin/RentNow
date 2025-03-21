import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";
import {
  handleInputChangeWithValidation,
  resetField,
  startsWithUppercase,
} from "../../service/UtilService";
function CreateCategoryModalWindow({
  isModalOpen,
  closeModal,
  setSignalCall,
  signalCall,
}) {
  const [categoryDTO, setCategoryDTO] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createCategory = () => {
    if (categoryDTO.length < 2) {
      showError("Category should have more than 2 characters!");
    } else if (categoryDTO.charAt(0) !== categoryDTO.charAt(0).toUpperCase()) {
      showError("Should start with an uppercase letter!");
    } else {
      let url = "/category/create";
      axios
        .post(url, {
          name: categoryDTO,
        })
        .then(() => {
          setSignalCall(!signalCall);
          closeModal();
          showSuccess("Category added successfully!");
          setCategoryDTO("");
        })
        .catch((error) => {
          if (error.response) {
            const message = JSON.stringify(error.response.data)
              .replace('"', "")
              .replace('"', "");
            showError(message);
          }
        });
    }
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal}>
      <div className="w-full reverseColors">
        <FontAwesomeIcon
          className="absolute top-4 right-4 cursor-pointer"
          icon={faTimes}
          size="xl"
          onClick={closeModal}
        />
        <div className="ml-4 mt-2.5 modal-text font-bold reverseColors">
          Add new category
        </div>
      </div>
      <DialogContent className="reverseColors">
        <div className="mt-5">
          <TextField
            className="w-full"
            id="outlined-read-only-input"
            label="Name"
            defaultValue=""
            required
            error={!!errorMessage}
            helperText={errorMessage}
            onChange={(e) => {
              handleInputChangeWithValidation(
                e,
                setCategoryDTO,
                setErrorMessage,
                startsWithUppercase,
                "Should start with lowercase",
                100
              );
              setCategoryDTO(e.target.value);
            }}
            InputLabelProps={{ className: "text-white reverseColors" }}
            InputProps={{ className: "text-white reverseColors" }}
          />
        </div>
        <div className="flex gap-x-2 mt-6">
          <button
            className="details-button"
            variant="contained"
            onClick={createCategory}
            disabled={!!errorMessage || categoryDTO.length === 0}
          >
            Save
          </button>
          <button
            className="details-button details-button-red"
            onClick={() => {
              resetField(setCategoryDTO, "");
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

export default CreateCategoryModalWindow;
