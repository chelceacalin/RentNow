import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
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
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          padding: 2,
        }}
        className="reverseColors"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 2,
          }}
          className="reverseColors"
        >
          <Typography
            variant="h6"
            sx={{ color: "black", fontWeight: 600 }}
            className="reverseColors"
          >
            Edit Book
          </Typography>
          <IconButton onClick={closeModal} sx={{ color: "black" }}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </IconButton>
        </Box>

        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ width: "70%" }}>
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
                className={`rent-button reset-width ${
                  formData.isAvailable ? "" : "disabled"
                }`}
                style={{
                  cursor: formData.isAvailable ? "pointer" : "not-allowed",
                }}
              >
                Upload Image
              </label>

              {formErrors.selectedImage && (
                <Typography
                  sx={{ color: "red", fontSize: "0.875rem", marginTop: 1 }}
                >
                  {formErrors.selectedImage}
                </Typography>
              )}

              {imagePreviewUrl && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "black", marginBottom: 1 }}
                    className="reverseColors"
                  >
                    Image Preview
                  </Typography>
                  <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
                    <img
                      src={imagePreviewUrl}
                      alt="Selected"
                      className="object-cover w-full h-full"
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ flexGrow: 1, padding: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleInputChange("title")}
                variant="outlined"
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={!formData.isAvailable}
                InputLabelProps={{ className: "reverseColors" }}
                InputProps={{ className: "reverseColors mb-4" }}
              />

              <TextField
                fullWidth
                label="Author"
                value={formData.director}
                onChange={handleInputChange("director")}
                variant="outlined"
                error={!!formErrors.director}
                helperText={formErrors.director}
                disabled={!formData.isAvailable}
                InputLabelProps={{ className: "reverseColors" }}
                InputProps={{ className: "reverseColors mb-4" }}
              />

              <Autocomplete
                onChange={handleInputChange("category")}
                value={formData.category}
                options={availableCategories.map((c) => c.name)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    error={!!formErrors.category}
                    helperText={formErrors.category}
                    disabled={!formData.isAvailable}
                    InputLabelProps={{ className: " reverseColors" }}
                    InputProps={{ className: " reverseColors mb-4" }}
                  />
                )}
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange("description")}
                variant="outlined"
                multiline
                rows={10}
                error={!!formErrors.description}
                helperText={formErrors.description}
                disabled={!formData.isAvailable}
                InputLabelProps={{ className: " reverseColors" }}
                InputProps={{ className: " reverseColors mb-4 max-h-96" }}
              />
            </Box>
          </Box>

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
      </Box>
    </Dialog>
  );
}

export default DetailsBookModalView;
