import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Dialog, DialogContent, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function DetailsBookModalView({ isModalOpen, book, onRefresh, closeModal }) {
  const MAX_FILE_SIZE = 2048 * 2048;

  const [availableCategories, setAvailableCategories] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(book.photoUrl || "");
  const [formData, setFormData] = useState({
    title: book.title || "",
    director: book.director || "",
    description: book.description || "",
    category: book.category || "",
    selectedImage: book.photoUrl || "",
    isAvailable: book.isAvailable,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    axios
      .get(`/category`)
      .then((response) => {
        setAvailableCategories(response.data.content);
      })
      .catch((error) => {
        showError(error.message);
      });
  }, []);

  const handleInputChange = (field) => (event, value) => {
    const newValue = value !== undefined ? value : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.size <= MAX_FILE_SIZE &&
      ["image/jpeg", "image/png"].includes(file.type)
    ) {
      setFormData((prev) => ({ ...prev, selectedImage: file }));
      setFormErrors((prev) => ({ ...prev, selectedImage: null }));
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        selectedImage: "Invalid image file",
      }));
      setImagePreviewUrl(null);
    }
  };

  const validateForm = () => {
    const { title, director, category, description, selectedImage } = formData;
    const errors = {};

    if (
      !title ||
      title.length < 2 ||
      title.charAt(0) !== title.charAt(0).toUpperCase()
    ) {
      errors.title =
        "Title should have at least 2 characters and start with an uppercase letter";
    }
    if (
      !director ||
      director.length < 2 ||
      director.charAt(0) !== director.charAt(0).toUpperCase()
    ) {
      errors.director =
        "Director should have at least 2 characters and start with an uppercase letter";
    }
    if (!category) errors.category = "Please select a category";
    if (!description) errors.description = "Description should not be empty";
    if (!selectedImage) errors.selectedImage = "Please select an image";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    const formDataToSubmit = new FormData();
    const bookDTO = {
      title: formData.title,
      director: formData.director,
      description: formData.description,
      category: formData.category,
    };

    formDataToSubmit.append(
      "bookDTO",
      new Blob([JSON.stringify(bookDTO)], { type: "application/json" })
    );

    if (formData.selectedImage) {
      formDataToSubmit.append("imageFile", formData.selectedImage);
    }

    axios
      .post(`/books/${book.id}`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        showSuccess("Book edited successfully!");
        onRefresh();
        closeModal();
      })
      .catch((err) => {
        showError("Error editing book: " + err.message);
      });
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
      <div className="modal-content wider-modal">
        <div className="header-container">
          <FontAwesomeIcon
            className="absolute top-4 right-4 cursor-pointer"
            icon={faTimes}
            size="xl"
            onClick={closeModal}
          />
          <h2 className="ml-8 mt-6 text-2xl">Edit Book</h2>
        </div>
        <DialogContent className="modal-body ml-2 mr-2">
          <div className="flex flex-col space-y-4 mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="imageUpload"
              disabled={!formData.isAvailable}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className={`rent-button -sm ${
                formData.isAvailable ? "" : "disabled"
              }`}
            >
              Upload Image
            </label>

            {formErrors.selectedImage && (
              <p className="bg-main-color text-sm">
                {formErrors.selectedImage}
              </p>
            )}

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

            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleInputChange("title")}
              variant="outlined"
              error={!!formErrors.title}
              helperText={formErrors.title}
              disabled={!formData.isAvailable}
            />

            <TextField
              fullWidth
              label="Director"
              value={formData.director}
              onChange={handleInputChange("director")}
              variant="outlined"
              error={!!formErrors.director}
              helperText={formErrors.director}
              disabled={!formData.isAvailable}
            />

            <Autocomplete
              onChange={handleInputChange("category")}
              value={formData.category}
              options={availableCategories.map((c) => c.name)}
              renderInput={(params) => (
                <TextField {...params} label="Category" />
              )}
              error={!!formErrors.category}
              helperText={formErrors.category}
              disabled={!formData.isAvailable}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange("description")}
              variant="outlined"
              multiline
              rows={4}
              error={!!formErrors.description}
              helperText={formErrors.description}
              disabled={!formData.isAvailable}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="details-button"
              disabled={!formData.isAvailable}
            >
              Save
            </button>
            <button
              onClick={(e) => {
                closeModal();
              }}
              className="details-button details-button-red"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DetailsBookModalView;
