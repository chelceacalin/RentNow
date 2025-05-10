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
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const MAX_FILE_SIZE = 2048 * 2048;

  console.log(book)

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
        selectedImage: "Please select a JPEG or PNG image under 4MB",
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
        "Please enter a title starting with a capital letter (min. 2 characters)";
    }
    if (
      !director ||
      director.length < 2 ||
      director.charAt(0) !== director.charAt(0).toUpperCase()
    ) {
      errors.director =
        "Please enter an author name starting with a capital letter";
    }
    if (!category) errors.category = "Please select a category";
    if (!description) errors.description = "Please add a book description";
    if (!selectedImage) errors.selectedImage = "Please select a cover image";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      showError("Please complete all required fields");
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
        showSuccess("Book updated successfully!");
        onRefresh();
        closeModal();
      })
      .catch((err) => {
        showError("Error updating book: " + err.message);
      });
  };

  return (
    <Dialog 
      open={isModalOpen} 
      onClose={closeModal} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: { 
          borderRadius: '8px', 
          overflow: 'hidden',
        }
      }}
    >
      <Box sx={{ position: "relative", padding: 2 }} className="reverseColors">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            marginBottom: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600 }}
            className="reverseColors"
          >
            Edit Book
          </Typography>
          <IconButton onClick={closeModal} sx={{ color: "black" }}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </IconButton>
        </Box>

        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{ display: "flex", flexDirection: {xs: 'column', md: 'row'}, gap: 3 }}>
            {/* Left side - Image section */}
            <Box sx={{ width: {xs: '100%', md: '40%'} }}>
              <Typography 
                variant="subtitle2" 
                sx={{ marginBottom: 1, fontWeight: 500 }}
                className="reverseColors"
              >
                Book Cover
              </Typography>
              
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
                className={`rent-button reset-width ${formData.isAvailable ? "" : "disabled"}`}
                style={{
                  cursor: formData.isAvailable ? "pointer" : "not-allowed",
                  display: "inline-block",
                  marginBottom: "12px",
                  width: "100%",
                  textAlign: "center",
                  padding: "8px 16px",
                }}
              >
                Upload Image
              </label>

              {formErrors.selectedImage && (
                <Typography
                  sx={{ color: "red", fontSize: "0.75rem", marginBottom: 1 }}
                >
                  {formErrors.selectedImage}
                </Typography>
              )}

              {imagePreviewUrl && (
                <Box 
                  sx={{ 
                    marginTop: 1,
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 1,
                    padding: 1,
                    height: "280px",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ marginBottom: 1 }}
                    className="reverseColors"
                  >
                    Image Preview
                  </Typography>
                  <Box 
                    sx={{ 
                      borderRadius: 1, 
                      overflow: "hidden",
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer"
                    }}
                    onClick={() => setIsImageExpanded(true)}
                  >
                    <img
                      src={imagePreviewUrl}
                      alt="Book cover"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: "4px"
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Right side - Form fields */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ marginBottom: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ marginBottom: 1, fontWeight: 500 }}
                  className="reverseColors"
                >
                  Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  variant="outlined"
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  disabled={!formData.isAvailable}
                  size="small"
                  InputLabelProps={{ className: "reverseColors" }}
                  InputProps={{ className: "reverseColors" }}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ marginBottom: 1, fontWeight: 500 }}
                  className="reverseColors"
                >
                  Author
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter author name"
                  value={formData.director}
                  onChange={handleInputChange("director")}
                  variant="outlined"
                  error={!!formErrors.director}
                  helperText={formErrors.director}
                  disabled={!formData.isAvailable}
                  size="small"
                  InputLabelProps={{ className: "reverseColors" }}
                  InputProps={{ className: "reverseColors" }}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ marginBottom: 1, fontWeight: 500 }}
                  className="reverseColors"
                >
                  Category
                </Typography>
                <Autocomplete
                  onChange={handleInputChange("category")}
                  value={formData.category}
                  options={availableCategories.map((c) => c.name)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select a category"
                      error={!!formErrors.category}
                      helperText={formErrors.category}
                      disabled={!formData.isAvailable}
                      InputLabelProps={{ className: "reverseColors" }}
                      InputProps={{ ...params.InputProps, className: "reverseColors" }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ marginBottom: 1, fontWeight: 500 }}
                  className="reverseColors"
                >
                  Description
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter book description"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  variant="outlined"
                  multiline
                  rows={6}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  disabled={!formData.isAvailable}
                  InputLabelProps={{ className: "reverseColors" }}
                  InputProps={{ className: "reverseColors" }}
                />
              </Box>
            </Box>
          </Box>

          <Box 
            sx={{ 
              marginTop: 3, 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: 2,
              borderTop: "1px solid rgba(0,0,0,0.1)",
              paddingTop: 2
            }}
          >
            <button
              onClick={closeModal}
              className="details-button details-button-red"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="details-button"
              disabled={!formData.isAvailable}
            >
              Save
            </button>
          </Box>
        </DialogContent>
      </Box>
      
      {/* Image Lightbox/Expanded View */}
      {isImageExpanded && imagePreviewUrl && (
        <Dialog 
          open={isImageExpanded} 
          onClose={() => setIsImageExpanded(false)}
          maxWidth="lg"
          PaperProps={{
            style: { 
              backgroundColor: "rgba(0,0,0,0.85)", 
              boxShadow: "none",
              overflow: "hidden",
              borderRadius: "8px"
            }
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "90vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton 
              onClick={() => setIsImageExpanded(false)}
              sx={{ 
                position: "absolute", 
                top: 16, 
                right: 16, 
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.8)"
                }
              }}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </IconButton>
            
            <img
              src={imagePreviewUrl}
              alt="Book cover expanded view"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
                borderRadius: "4px"
              }}
            />
          </Box>
        </Dialog>
      )}
    </Dialog>
  );
}

export default DetailsBookModalView;