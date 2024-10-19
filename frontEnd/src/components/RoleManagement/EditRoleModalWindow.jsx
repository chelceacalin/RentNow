import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function EditRoleModalWindow({
  isModalOpen,
  closeModal,
  updateUser,
  user,
  isCurrentUser,
  setRefreshImg,
  isAdmin,
}) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [selectedActivity, setSelectedActivity] = useState(user.is_active);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(user.photoUrl || "");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(0);

  const [userDTO, setUserDTO] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    is_active: false,
    photoUrl: user.photoUrl || "",
  });

  const role_type = ["ADMIN", "USER"];
  const active_type = ["ACTIVE", "INACTIVE"];
  const MAX_FILE_SIZE = 2048 * 2048;
  const monthOptions = [
    { label: "All Months", value: 0 },
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];
  const getReport = () => {
    const monthQuery = selectedMonth === 0 ? "" : `?month=${selectedMonth}`;
    axios
      .get(`/reports/download-pdf/${user.email}${monthQuery}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          selectedMonth === 0
            ? `${user.email}-all-months-bookReport.pdf`
            : `${user.email}-${selectedMonth}-bookReport.pdf`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess("PDF Report successfully downloaded.");
      })
      .catch((error) => {
        showError("No reports available for that month");
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      setSelectedRole(user.role);
      setSelectedActivity(user.is_active);
      setImagePreviewUrl(user.photoUrl || "");
    }
  }, [isModalOpen, user]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.size <= MAX_FILE_SIZE &&
      ["image/jpeg", "image/png"].includes(file.type)
    ) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
      showError("Image could not be loaded!");
    }
  };

  const mapToActiveType = selectedActivity ? "ACTIVE" : "INACTIVE";

  useEffect(() => {
    setUserDTO(() => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: selectedRole,
      is_active: selectedActivity,
      photoUrl: imagePreviewUrl,
    }));
  }, [selectedRole, selectedActivity, imagePreviewUrl, user]);

  const isFormValid = () => {
    if (!selectedRole || selectedRole.length === 0) {
      showError("You can't update with an empty role");
      return false;
    }
    if (selectedActivity == null || selectedActivity === "") {
      showError("You can't update with an empty status");
      return false;
    }

    return true;
  };

  const editUser = () => {
    if (!isFormValid()) {
      return;
    }
    let url = "/users/update/" + selectedRole;

    const data = new FormData();
    data.append(
      "userDTO",
      new Blob([JSON.stringify(userDTO)], { type: "application/json" })
    );

    if (selectedImage.length === 0 && imagePreviewUrl.length === 0) {
      showError("Cannot use empty image!");
      return;
    }
    if (selectedImage) {
      data.append("imageFile", selectedImage);
    }

    axios
      .post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        showSuccess("User edited successfully!");
        sessionStorage.setItem("is_active", selectedActivity);
        if (updateUser != null) {
          updateUser(userDTO);
        }
        if (setRefreshImg) {
          setRefreshImg((prev) => !prev);
        }

        closeModal();
      })
      .catch((error) => {
        showError("Error editing user: " + error.message);
      });
  };

  const handleFirstNameChange = (event) => {
    const updatedFirstName = event.target.value;
    setUserDTO((prevState) => ({ ...prevState, firstName: updatedFirstName }));
  };

  const handleLastNameChange = (event) => {
    const updatedLastName = event.target.value;
    setUserDTO((prevState) => ({ ...prevState, lastName: updatedLastName }));
  };

  return (
    <Dialog maxWidth={"lg"} open={isModalOpen} onClose={closeModal}>
      <FontAwesomeIcon
        className="absolute top-4 right-4 cursor-pointer"
        icon={faTimes}
        size="xl"
        onClick={closeModal}
      />
      <div className="w-full">
        <h2 className="modal-text ms-6 mt-2">
          Edit{" "}
          {isCurrentUser ? <span>account info</span> : <span>user info</span>}
        </h2>
      </div>
      <DialogContent>
        <div className="flex w-full">
          <div className="w-2/3 pr-5">
            {isCurrentUser && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="imageUpload"
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className={`rent-button reset-width w-full reset-margin-left`}
                >
                  Upload Image
                </label>
                {imagePreviewUrl && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Image Preview
                    </h3>
                    <div className="border rounded-lg overflow-hidden w-full h-52">
                      <img
                        src={imagePreviewUrl}
                        alt="Selected"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mb-4 mt-4">
              <TextField
                label="First Name"
                value={userDTO.firstName}
                onChange={handleFirstNameChange}
                fullWidth
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Last Name"
                value={userDTO.lastName}
                onChange={handleLastNameChange}
                fullWidth
              />
            </div>
            {isAdmin && (
              <>
                <div className="mt-6">
                  <Autocomplete
                    value={selectedRole}
                    onChange={(_, value) => {
                      setSelectedRole(value);
                    }}
                    options={role_type}
                    renderInput={(params) => (
                      <TextField {...params} label="Role" />
                    )}
                  />
                </div>
                <div className="mt-6">
                  <Autocomplete
                    value={mapToActiveType}
                    onChange={(_, value) => {
                      setSelectedActivity(value === "ACTIVE");
                    }}
                    options={active_type}
                    renderInput={(params) => (
                      <TextField {...params} label="Active Status" />
                    )}
                  />
                </div>
              </>
            )}

            <div className="w-full mt-5">
              <button
                className="details-button db-sm"
                onClick={(_) => {
                  editUser();
                }}
              >
                Save
              </button>
              <button
                className="details-button details-button-red db-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right side: First Name and Last Name Editing */}
          <div className="w-2/3 pl-5 border-l border-gray-300">
            <div className="mt-5">
              <TextField
                disabled
                id="outlined-read-only-input"
                className="w-full"
                label="Name"
                defaultValue={user.username}
              />
            </div>
            <div className="mt-4 mb-4">
              <TextField
                id="outlined-read-only-input"
                className="w-auto"
                label="Email"
                defaultValue={user.email}
                disabled
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2">Get Books Report:</label>
              <div className="flex items-center mb-4">
                <label className="mr-2">Select Month:</label>
                <select
                  className="month-select p-2 border rounded-md"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="details-button reset-width"
                onClick={getReport}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditRoleModalWindow;
