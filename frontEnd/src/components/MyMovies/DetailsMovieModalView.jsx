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

function DetailsMovieModalView({
  isModalOpen,
  defaultTitle,
  defaultDirector,
  isAvailable,
  defaultCategory,
  id,
  triggerRefresh,
  setTriggerRefresh,
  photoUrl,
  closeModal,
}) {
  const [selectedImage, setSelectedImage] = useState(photoUrl);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState(defaultTitle);
  const [director, setDirector] = useState(defaultDirector);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(photoUrl);

  const MAX_FILE_SIZE = 2048 * 2048;
  useEffect(() => {
    axios.get(`/books/${id}`).then((data) => {
      if (data.data.description.length > 0) {
        setDescription(data.data.description);
      }
    });
  }, []);

  const validationChecks = [
    {
      condition: !title || title.length < 2,
      message: "Title should have at least 2 characters!",
    },
    {
      condition: !director || director.length < 2,
      message: "Director should have at least 2 characters!",
    },
    {
      condition: !description || description.length < 2,
      message: "Description should have at least 2 characters!",
    },
  ];

  const handleImageBrowse = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showError("Image size should be no more than 2 MB!");
        setSelectedImage(null);
        setImagePreviewUrl(null);
      } else if (
        !["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        showError("Image format should be jpg, jpeg, or png!");
        setSelectedImage(null);
        setImagePreviewUrl(null);
      } else {
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showError("Image size should be no more than 2 MB!");
        setSelectedImage(null);
        setImagePreviewUrl(null);
      } else if (
        !["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        showError("Image format should be jpg, jpeg, or png!");
        setSelectedImage(null);
        setImagePreviewUrl(null);
      } else {
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  useEffect(() => {
    let url = `/category`;
    axios
      .get(url)
      .then((response) => {
        setAvailableCategories(response.data.content);
      })
      .catch((error) => {
        showError(error.message);
      });
  }, []);

  const validRequest = () => {
    for (const check of validationChecks) {
      if (check.condition) {
        showError(check.message);
        return false;
      }
    }
    return true;
  };

  const validFields = () => {
    let valid = true;
    if (title.charAt(0) !== title.charAt(0).toUpperCase()) {
      showError("Title should start with an uppercase letter!");
      valid = false;
    }

    if (director.charAt(0) !== director.charAt(0).toUpperCase()) {
      showError("Director should start with an uppercase letter!");
      valid = false;
    }
    return valid;
  };

  const handleSave = () => {
    if (validRequest()) {
      if (!selectedImage) {
        showError("Image should not be empty!");
        return;
      }

      if (validFields()) {
        if (!category) {
          showError("Category " + category + " does not exist ");
        } else {
          let finalCategory = category;

          const formData = new FormData();
          let bookDTO = {
            title: title,
            director: director,
            description: description,
            category: finalCategory,
          };

          formData.append(
            "bookDTO",
            new Blob([JSON.stringify(bookDTO)], { type: "application/json" })
          );

          console.log("selected image" + selectedImage);
          if (selectedImage) {
            formData.append("imageFile", selectedImage);
          }

          axios
            .post(`/books/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              setTriggerRefresh(!triggerRefresh);
              showSuccess("Movie edited successfully!", "bg-green-500");
              resetForm();
              closeModal();
            })
            .catch((err) => {
              showError("Error editing book: " + err.message);
            });
        }
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDirector("");
    setDescription("");
    setCategory("");
    setSelectedImage(null);
  };

  return (
    <Dialog maxWidth={"md"} open={isModalOpen} onClose={closeModal}>
      <div className="modal-content wider-modal">
        <div className="header-container">
          <FontAwesomeIcon
            className="absolute top-4 right-4 cursor-pointer"
            icon={faTimes}
            size="xl"
            onClick={closeModal}
          />
          <div className="w-full">
            <h2 className="header-title ml-6 mt-10">Edit book</h2>
          </div>
        </div>
        <DialogContent className="modal-body ml-2 mr-2">
          <div>
            <TextField
              label="Title"
              required
              disabled={!isAvailable}
              sx={{
                width: { md: 835 },
              }}
              defaultValue={title}
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
              sx={{
                width: { md: 835 },
              }}
              defaultValue={director}
              onChange={(e) => {
                setDirector(e.target.value);
              }}
              InputProps={{
                style: { fontFamily: "Sanchez" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Sanchez" },
              }}
              disabled={!isAvailable}
            />
          </div>
          <div className="mt-6">
            <Autocomplete
              onChange={(e, value) => setCategory(value)}
              value={category}
              sx={{
                width: { md: 835 },
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
              disabled={!isAvailable}
            />
          </div>
          <div className="mt-6">
            <TextField
              required
              placeholder=" Write a description for the book..."
              label="Description"
              multiline={true}
              className="textarea-field w-full border-2 p-2"
              value={description}
              rows={4}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              InputProps={{
                style: { fontFamily: "Sanchez" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Sanchez" },
              }}
              disabled={!isAvailable}
            />
          </div>

          <div className="field-group image-upload-field">
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Image Upload</h2>
              <div
                className="border-2 border-gray-400 p-4 rounded-lg mb-4"
                onDrop={() => {
                  if (!isAvailable) {
                    showError(
                      "You cannot drop images because book is rented! "
                    );
                  } else {
                    handleImageDrop();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
              >
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Selected"
                    className="w-40 h-40 object-cover rounded-lg"
                    disabled={!isAvailable}
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
                disabled={!isAvailable}
              />
            </div>
          </div>
          <div className="modal-footer mt-4 flex gap-x-2">
            <div className="flex-1">
              <Button
                type="button"
                onClick={handleSave}
                className="w-full darkButton"
                variant="contained"
                disabled={!isAvailable}
              >
                Save
              </Button>
            </div>

            <div className="flex-1">
              <Button
                type="button"
                onClick={() => {
                  console.log("Click");
                  closeModal();
                  console.log("open " + isModalOpen);
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

export default DetailsMovieModalView;
