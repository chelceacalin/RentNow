import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Button, Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import * as moreClasses from "react-dom/test-utils";
import { showError, showSuccess } from "../../service/ToastService";

function DetailsMovieModalView({
  isModalOpen,
  closeModal,
  defaultTitle,
  defaultDirector,
  isAvailable,
  defaultCategory,
  id,
  triggerRefresh,
  setTriggerRefresh,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState(defaultTitle);
  const [director, setDirector] = useState(defaultDirector);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory);

  const fetchMovieImage = async () => {
    try {
      const response = await axios.get(`/imagesByMovieID/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "image/png" });
      const avatarUrl = URL.createObjectURL(blob);

      setSelectedImage(avatarUrl);
    } catch (error) {}
  };

  useEffect(() => {
    axios.get(`/movies/${id}`).then((data) => {
      if (data.data.description.length > 0) {
        setDescription(data.data.description);
      }
    });
    fetchMovieImage();
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
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedImageFile(file);
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedImageFile(file);
    }
  };

  useEffect(() => {
    let url = `/category`;
    axios
      .get(url)
      .then((response) => {
        setAvailableCategories(response.data.content);
      })
      .catch((error) => {});
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
      if (validFields()) {
        if (!category) {
          showError("Category " + category + " does not exist ");
        } else {
          let finalCategory = category;

          if (selectedImageFile) {
            const formData = new FormData();

            formData.append("image", selectedImageFile);

            axios
              .post(`/images/${id}`, formData)
              .then((response) => {
                if (response.status === 200) {
                  showSuccess("Image uploaded successfully!", "bg-green-500");
                } else {
                  showError("Failed to upload image.");
                }
              })
              .catch((error) => {
                showError("Error uploading image: " + error.message);
              });
          }

          let movie = {
            title: title,
            director: director,
            description: description,
            category: finalCategory,
          };

          axios
            .post(`/movies/${id}`, movie)
            .then((response) => {
              showSuccess("Movie edited successfully!", "bg-green-500");
              setTriggerRefresh(!triggerRefresh);
              closeModal();
            })
            .catch((err) => {
              showError("Error editing movie: " + err.message);
            });
        }
      }
    }
  };

  return (
    <Dialog fullWidth maxWidth={"md"} open={isModalOpen} onClose={closeModal}>
      <div className="modal-content wider-modal">
        <div className="header-container">
          <FontAwesomeIcon
            className="absolute top-4 right-4 cursor-pointer"
            icon={faTimes}
            size="xl"
            onClick={closeModal}
          />
          <div className="w-full">
            <h2 className="header-title ml-6 mt-10">Edit movie</h2>
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
              placeholder=" Write a description for the movie..."
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
                      "You cannot drop images because movie is rented! "
                    );
                  } else {
                    handleImageDrop();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
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
                className="w-full"
                variant="contained"
                disabled={!isAvailable}
              >
                Save
              </Button>
            </div>

            <div className="flex-1">
              <Button
                type="button"
                onClick={closeModal}
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
