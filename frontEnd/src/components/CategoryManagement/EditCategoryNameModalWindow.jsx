import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Dialog,
    DialogContent,
    FormControl,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function EditCategoryNameModalWindow({
  isModalOpen,
  closeModal,
  id,
  name,
  updateCategory,
}) {
  const newNameRef = useRef();

  const editCategoryName = () => {
    let url = "/category/update/" + id;

    if (
      newNameRef.current.value.charAt(0) !==
      newNameRef.current.value.charAt(0).toUpperCase()
    ) {
      showError("Name should start with an uppercase letter!");
      return;
    }

    if (newNameRef.current.value.length < 2) {
      showError("Name should have at least 2 characters!");
      return;
    }

    axios
      .post(url, {
        id: id,
        name: newNameRef.current.value,
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
    <Dialog  maxWidth={"sm"} open={isModalOpen} onClose={closeModal}>
      <FontAwesomeIcon
        className="absolute top-4 right-4 cursor-pointer"
        icon={faTimes}
        size="xl"
        onClick={closeModal}
      />
      <div className="w-full">
        <h2 className="header-title ml-6 mt-10">Edit category</h2>
      </div>
      <DialogContent>
        <div className="mt-5">
          <TextField
            className="w-full"
            id="outlined-read-only-input"
            label="Name"
            defaultValue={name}
            inputRef={newNameRef}
            InputProps={{
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>
        <div>
          <FormControl >
            <div className="flex gap-x-2 mt-6">
              <div className="flex-1">
                <Button
                  className="w-full darkButton"
                  variant="contained"
                  onClick={editCategoryName}
                >
                  Save
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  className="outlined-button w-full darkButton"
                  variant="outlined"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormControl>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategoryNameModalWindow;
