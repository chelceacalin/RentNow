import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import * as moreClasses from "react-dom/test-utils";
import { showError, showSuccess } from "../../service/ToastService";

function EditRoleModalWindow({
  isModalOpen,
  closeModal,
  name,
  firstName,
  lastName,
  role,
  email,
  username,
  updateUser,
}) {
  const fullName = `${name}`;
  const [roles, setRole] = useState(role);
  const [selectedOption, setSelectedOption] = useState(role);

  const [userDTO, setUserDTO] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const role_type = ["ADMIN", "USER"];

  useEffect(() => {
    setUserDTO(() => ({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: selectedOption,
    }));
  }, [role, selectedOption]);

  const editUserRole = () => {
    let url = "/users/update/" + selectedOption;

    setUserDTO(() => ({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: selectedOption,
    }));
    axios
      .post(url, userDTO)
      .then(() => {
        showSuccess("User edited successfully!", "bg-green-500");
        updateUser(userDTO);
        closeModal();
      })
      .catch((error) => {
        showError("Error editing user: " + error.message);
      });
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
        <h2 className="header-title ml-6 mt-10">Edit user role</h2>
      </div>
      <DialogContent>
        <div className="mt-5">
          <TextField
            disabled
            id="outlined-read-only-input"
            className="w-full"
            label="Name"
            defaultValue={fullName}
            InputProps={{
              readOnly: true,
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>
        <div className="mt-4 mb-4">
          <TextField
            id="outlined-read-only-input"
            className="w-full"
            label="Email"
            defaultValue={email}
            disabled
            InputProps={{
              readOnly: true,
              style: { fontFamily: "Sanchez" },
            }}
            InputLabelProps={{
              style: { fontFamily: "Sanchez" },
            }}
          />
        </div>
        <div className="mt-6">
          <Autocomplete
            sx={{ fontFamily: "Sanchez" }}
            value={selectedOption}
            onChange={(e, value) => {
              setSelectedOption(value);
            }}
            ListboxProps={{
              style: { fontFamily: "Sanchez" },
            }}
            options={role_type}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{
                  style: { fontFamily: "Sanchez" },
                }}
                InputProps={{
                  ...params.InputProps,
                  ...moreClasses.input,
                  style: { fontFamily: "Sanchez" },
                }}
                sx={{ fontFamily: "Sanchez" }}
                label="Role"
              />
            )}
          />
          <div className="flex gap-x-2 mt-6">
            <div className="flex-1">
              <Button
                className="contained-button w-full"
                variant="contained"
                onClick={editUserRole}
              >
                Save
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditRoleModalWindow;
