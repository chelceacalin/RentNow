import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function CreateCategoryModalWindow({
  isModalOpen,
  closeModal,
  setSignalCall,
  signalCall,
}) {
  const [categoryDTO, setCategoryDTO] = useState("");

  const createCategory = () => {
    if (categoryDTO.length < 2) {
      showError("Category should have more than 2 characters!");
    } else if (categoryDTO.charAt(0) !== categoryDTO.charAt(0).toUpperCase()) {
      showError("Category should start with an uppercase letter!");
    } else {
      let url = "/category/create";
      axios
        .post(url, {
          name: categoryDTO,
        })
        .then(() => {
          setSignalCall(!signalCall);
          closeModal();
          showSuccess("Category added successfully!", "bg-green-500");
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
    <Dialog fullWidth maxWidth={"sm"} open={isModalOpen} onClose={closeModal}>
      <FontAwesomeIcon
        className="absolute top-4 right-4 cursor-pointer"
        icon={faTimes}
        size="xl"
        onClick={closeModal}
      />
      <div className="w-full">
        <h2 className="header-title ml-6 mt-10">Add new category</h2>
      </div>
      <DialogContent>
        <div className="mt-5">
          <TextField
            className="w-full"
            id="outlined-read-only-input"
            label="Name"
            defaultValue=""
            onChange={(e) => {
              setCategoryDTO(e.target.value);
            }}
            InputProps={{
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>
        <div className="flex gap-x-2 mt-6">
          <div className="flex-1">
            <Button
              className="contained-button w-full darkButton"
              variant="contained"
              onClick={createCategory}
            >
              Add
            </Button>
          </div>
          <div className="flex-1">
            <Button
              className="outlined-button w-full"
              variant="outlined"
              onClick={() => {
                setCategoryDTO("");
                closeModal();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryModalWindow;
