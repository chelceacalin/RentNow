import { Autocomplete, Button, Dialog, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";
import { UserLoginContext } from "../../utils/context/LoginProvider";

function AddNewMovieModalWindow({ isOpen, onClose, onRefresh }) {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    description: "",
    category: null,
    selectedImage: null,
  });
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
    setFormData((prev) => ({
      ...prev,
      [field]: value !== undefined ? value : event.target.value,
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
    } else {
      showError("Invalid image file");
    }
  };

  const validateForm = () => {
    const { title, director, category, description, selectedImage } = formData;
    if (!title || title.length < 2)
      return "Title should have at least 2 characters";
    if (!director || director.length < 2)
      return "Director should have at least 2 characters";
    if (!category) return "Please select a category";
    if (!description) return "Description should not be empty";
    if (!selectedImage) return "Please select an image";
    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      showError(error);
      return;
    }

    const movieDTO = {
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
      "movieDTO",
      new Blob([JSON.stringify(movieDTO)], { type: "application/json" })
    );
    data.append("imageFile", formData.selectedImage);

    try {
      await axios.post("/movies", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSuccess("Movie successfully created!");
      onRefresh();
      onClose();
    } catch (error) {
      showError("Failed to create movie");
    } finally {
      setFormData({});
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-6 bg-gray-800 text-white">
        <h2 className="text-2xl mb-4">Add New Movie</h2>
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={handleInputChange("title")}
            variant="outlined"
            InputLabelProps={{ className: "text-white" }}
            InputProps={{ className: "text-white" }}
          />
          <TextField
            fullWidth
            label="Director"
            value={formData.director}
            onChange={handleInputChange("director")}
            variant="outlined"
            InputLabelProps={{ className: "text-white" }}
            InputProps={{ className: "text-white" }}
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
                InputLabelProps={{ className: "text-white" }}
                InputProps={{ ...params.InputProps, className: "text-white" }}
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
            rows={4}
            InputLabelProps={{ className: "text-white" }}
            InputProps={{ className: "text-white" }}
          />
          <div>
            <label className="block mb-2">Select Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.selectedImage && (
              <img
                src={URL.createObjectURL(formData.selectedImage)}
                alt="Selected"
                className="w-40 h-40 object-cover mt-4"
              />
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default AddNewMovieModalWindow;
