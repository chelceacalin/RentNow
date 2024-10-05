import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
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
  is_active,
}) {
  const fullName = `${name}`;
  const [selectedRole, setSelectedRole] = useState(role);
  const [selectedActivity, setSelectedActivity] = useState(is_active);

  const [userDTO, setUserDTO] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    is_active: false,
  });

  const role_type = ["ADMIN", "USER"];
  const active_type = ["ACTIVE", "INACTIVE"];

  const mapToActiveType = selectedActivity ? "ACTIVE" : "INACTIVE";
  useEffect(() => {
    setUserDTO(() => ({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: selectedRole,
      is_active: selectedActivity,
    }));
  }, [selectedRole, selectedActivity]);

  const editUserRole = () => {
    let url = "/users/update/" + selectedRole;

    if (!selectedRole || selectedRole.length === 0) {
      showError("You can't update with an empty role");
      return;
    }

    setUserDTO(() => ({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: selectedRole,
      is_active: selectedActivity,
    }));
    axios
      .post(url, userDTO)
      .then(() => {
        showSuccess("User edited successfully!");
        sessionStorage.setItem("is_active", selectedActivity);
        updateUser(userDTO);
        closeModal();
      })
      .catch((error) => {
        showError("Error editing user: " + error.message);
      });
  };

  return (
    <Dialog maxWidth={"md"} open={isModalOpen} onClose={closeModal}>
      <FontAwesomeIcon
        className="absolute top-4 right-4 cursor-pointer"
        icon={faTimes}
        size="xl"
        onClick={closeModal}
      />
      <div className="w-full">
        <h2 className="modal-text ms-6 mt-2">Edit user role</h2>
      </div>
      <DialogContent>
        <div className="mt-5">
          <TextField
            disabled
            id="outlined-read-only-input"
            className="w-full"
            label="Name"
            defaultValue={fullName}
          />
        </div>
        <div className="mt-4 mb-4">
          <TextField
            id="outlined-read-only-input"
            className="w-full"
            label="Email"
            defaultValue={email}
            disabled
          />
        </div>

        <div className="mt-6">
          <Autocomplete
            value={selectedRole}
            onChange={(e, value) => {
              setSelectedRole(value);
            }}
            options={role_type}
            renderInput={(params) => <TextField {...params} label="Role" />}
          />
        </div>
        <div className="mt-6">
          <div className="mt-6">
            <Autocomplete
              value={mapToActiveType}
              onChange={(e, value) => {
                setSelectedActivity(value === "ACTIVE");
              }}
              options={active_type}
              renderInput={(params) => (
                <TextField {...params} label="Active Status" />
              )}
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <button className="details-button db-sm" onClick={editUserRole}>
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

export default EditRoleModalWindow;
