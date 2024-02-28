import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Button, Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import * as moreClasses from "react-dom/test-utils";
import { showError, showSuccess } from "../../service/ToastService";
import { UserLoginContext } from "../../utils/context/LoginProvider";

function AddNewMovieModalWindow({
  isModalOpen,
  closeModal,
  setTriggerRefresh,
  triggerRefresh,
}) {
  const MAX_FILE_SIZE = 1024 * 1024;
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [categorySelect, setCategorySelect] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const { username,email } = useContext(UserLoginContext);
  const [owner_username, setOwnerUsername] = useState(username);

  const validationChecks = [
    {
      condition: !title || title.length < 2,
      message: "Title should have at least 2 characters!",
    },
    {
      condition: !director || director.length < 2,
      message: "Director should not be empty!",
    },
    {
      condition: availableCategories.length === 0,
      message: "Invalid category name!",
    },
    { condition: !description, message: "Description should not be empty!" },
  ];
  useEffect(() => {
    let url = `/category`;
    axios
      .get(url)
      .then((response) => {
        setAvailableCategories(response.data.content);
      })
      .catch((error) => {});
  }, [category]);

  const handleImageBrowse = (event) => {
    const file = event.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      showError("Image size should be no more than 1 MB!");
      setSelectedImage(null);
    } else if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      showError("Image format should be jpg, jpeg, or png!");
      setSelectedImage(null);
    } else {
      setSelectedImage(file);
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file.size > MAX_FILE_SIZE) {
      showError("Image size should be no more than 1 MB!");
      setSelectedImage(null);
    } else if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      showError("Image format should be jpg, jpeg, or png!");
      setSelectedImage(null);
    } else {
      setSelectedImage(file);
    }
  };

  const validRequest = () => {
    for (const check of validationChecks) {
      if (check.condition) {
        showError(check.message);
        return false;
      }
    }

    if (title.charAt(0) !== title.charAt(0).toUpperCase()) {
      showError("Title should start with an uppercase letter!");
      return false;
    }

    if (director.charAt(0) !== director.charAt(0).toUpperCase()) {
      showError("Director should start with an uppercase letter!");
      return false;
    }

    return true;
  };
  const handleSave = () => {
    if (validRequest()) {
      let urlAddMovie = `/movies`;

      let movie = {
        title: title,
        director: director,
        description: description,
        isAvailable: true,
        category: category,
        owner_username: owner_username,
        owner_email:email
      };

      console.log(movie);

      if (selectedImage) {
        axios
          .post(urlAddMovie, movie)
          .then((data)=>{
            setTriggerRefresh(!triggerRefresh);
            resetForm();
          })
          .catch((err) => {});

        closeModal();
      } else {
        showError("Image should not be empty!");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDirector("");
    setDescription("");
    setCategory("");
    setCategorySelect("");
    setSelectedImage(null);
  };
  return (
    <Dialog fullWidth maxWidth={"sm"} open={isModalOpen} onClose={closeModal}>
      <div className="modal-content wider-modal">
        <div className="header-container">
          <FontAwesomeIcon
            className="absolute top-4 right-4 cursor-pointer"
            icon={faTimes}
            size="xl"
            onClick={closeModal}
          />
          <div className="w-full">
            <h2 className="header-title ml-6 mt-10">Add new movie</h2>
          </div>
        </div>
        <DialogContent className="modal-body ml-2 mr-2">
          <div>
            <TextField
              required
              label="Title"
              fullWidth
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              InputProps={{
                style: { fontFamily: "Sanchez" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Sanchez" },
              }}
            />
          </div>
          <div className="mt-6">
            <TextField
              required
              label="Director"
              fullWidth
              onChange={(e) => {
                setDirector(e.target.value);
              }}
              InputProps={{
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
              onChange={(e, value) => setCategory(value)}
              value={category}
              ListboxProps={{
                style: { fontFamily: "Sanchez" },
              }}
              options={availableCategories.map((c) => c.name)}
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
                  label="Category"
                />
              )}
            />
          </div>
          <div className="field-group mt-4">
            <TextField
              required
              id="outlined-read-only-input"
              label="Description"
              multiline={true}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              sx={{
                width: { md: 537 },
              }}
              rows={4}
              InputProps={{
                style: { fontFamily: "Sanchez" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Sanchez" },
              }}
            />
          </div>

          <div className="field-group image-upload-field">
            <div>
              <h2 className="text-xl font-bold mb-4">Image Upload</h2>
              <div
                className=" border-2 border-gray-400 p-4 rounded-lg mb-4"
                onDrop={handleImageDrop}
                onDragOver={(event) => event.preventDefault()}
              >
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-500">
                    Drop or Browse to select an image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageBrowse}
                className="mb-4 w-full"
              />
            </div>
          </div>
          <div className="modal-footer mt-4 flex gap-x-2">
            <div className="flex-1">
              <Button
                type="button"
                onClick={handleSave}
                className="purpleBlueButton w-full"
                variant="contained"
              >
                Save
              </Button>
            </div>

            <div className="flex-1">
              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  closeModal();
                }}
                className="outlined-button w-full"
                variant="outlined"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default AddNewMovieModalWindow;
