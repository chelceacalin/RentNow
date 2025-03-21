import { Autocomplete, Dialog, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";
import { UserLoginContext } from "../../utils/context/LoginProvider";

function AddNewBookModalWindow({ isOpen, onClose, onRefresh }) {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    description: "",
    category: null,
    selectedImage: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const { username, email } = useContext(UserLoginContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category");
        setAvailableCategories(response.data.content.map((cat) => cat.name));
      } catch (error) {
        showError("Failed to fetch categories");
      }
    };

    fetchCategories();
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
    } else {
      setFormErrors((prev) => ({
        ...prev,
        selectedImage: "Invalid image file",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      director: "",
      description: "",
      category: null,
      selectedImage: null,
    });
    setFormErrors({});
  };
  const validateForm = () => {
    const { title, director, category, description, selectedImage } = formData;
    const errors = {};

    const validateTextField = (field, fieldName) => {
      if (!field || field.length < 2 || field[0] !== field[0].toUpperCase()) {
        return `${fieldName} should have at least 2 characters and start with an uppercase letter`;
      }
      return null;
    };

    const titleError = validateTextField(title, "Title");
    if (titleError) errors.title = titleError;

    const directorError = validateTextField(director, "Director");
    if (directorError) errors.director = directorError;

    if (!category) errors.category = "Please select a category";
    if (!description) errors.description = "Description should not be empty";
    if (!selectedImage) errors.selectedImage = "Please select an image";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) {
      showError("Please fix the errors in the form");
      return;
    }

    const bookDTO = {
      owner_username: username,
      owner_email: email,
      title: formData.title,
      director: formData.director,
      category: formData.category,
      description: formData.description,
      isAvailable: true,
    };

    const data = new FormData();
    data.append(
      "bookDTO",
      new Blob([JSON.stringify(bookDTO)], { type: "application/json" })
    );
    data.append("imageFile", formData.selectedImage);

    try {
      await axios.post("/books", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSuccess("Book successfully created!");
      onRefresh();
      onClose();
    } catch (error) {
      showError("Failed to create book");
    } finally {
      resetForm();
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-6 text-white reverseColors">
        <h2 className="text-2xl text-black mb-4 font-bold reverseColors">Add New Book</h2>
        <div className="flex flex-col space-y-4 mt-4 mb-6">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="imageUpload"
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer inline-block bg-main-color text-white font-semibold px-4 py-2 rounded-md "
            >
              Upload Image
            </label>
            {formErrors.selectedImage && (
              <p className="text-main-color text-sm">
                {formErrors.selectedImage}
              </p>
            )}
          </div>

          {formData.selectedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 reverseColors">
                Image Preview
              </h3>
              <div className="border rounded-lg overflow-hidden justify-center align-middle">
                <img
                  src={URL.createObjectURL(formData.selectedImage)}
                  alt="Selected"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={handleInputChange("title")}
            variant="outlined"
            required
            error={!!formErrors.title}
            helperText={formErrors.title}
            InputLabelProps={{ className: "text-white reverseColors" }}
            InputProps={{ className: "text-white reverseColors" }}
          />
          <TextField
            fullWidth
            label="Author"
            value={formData.director}
            onChange={handleInputChange("director")}
            variant="outlined"
            required
            error={!!formErrors.director}
            helperText={formErrors.director}
            InputLabelProps={{ className: "text-white reverseColors" }}
            InputProps={{ className: "text-white reverseColors" }}
          />
          <Autocomplete
            fullWidth
            options={availableCategories}
            value={formData.category}
            onChange={handleInputChange("category")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                variant="outlined"
                error={!!formErrors.category}
                helperText={formErrors.category}
                InputLabelProps={{ className: "text-white reverseColors" }}
                InputProps={{
                  ...params.InputProps,
                  className: "text-white reverseColors",
                }}
              />
            )}
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange("description")}
            variant="outlined"
            required
            multiline
            rows={5}
            error={!!formErrors.description}
            helperText={formErrors.description}
            InputLabelProps={{ className: "text-white reverseColors" }}
            InputProps={{ className: "text-white reverseColors" }}
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={handleSave} className="details-button">
            Save
          </button>
          <button
            onClick={(e) => {
              onClose(e);
              resetForm();
            }}
            className="details-button details-button-red"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default AddNewBookModalWindow;
