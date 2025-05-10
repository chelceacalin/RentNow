import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import { showError, showSuccess } from "../../service/ToastService";

function CloneBookModalView({ isModalOpen, book, onRefresh, closeModal }) {
  const { id, title, photoUrl } = book;
  let url = `/books/${id}`;

  const getBookById = async (id) => {
    try {
      const d = await axios.get(url);
      const newBook = {
        owner_username: d.data.owner_username,
        owner_email: d.data.owner_email,
        title: d.data.title,
        director: d.data.director,
        category: d.data.category,
        description: d.data.description,
        isAvailable: true,
      };
      return newBook;
    } catch (error) {
      showError(error.response?.data || "Failed to fetch the book.");
      return null;
    }
  };


  const getImageFile = async () => {
    try {
      const response = await fetch(photoUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const blob = await response.blob();
      let filename = photoUrl.split("/").pop() + "_" + new Date().getUTCMilliseconds();
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const cloneBook = async () => {

    let existingBook = await getBookById(id);
    if (existingBook === null) return;

    console.log(existingBook);

    const data = new FormData();
    data.append(
      "bookDTO",
      new Blob([JSON.stringify(existingBook)], { type: "application/json" })
    );

    let file = await getImageFile();

    if (file === null||file === undefined) {
      showError("Failed to fetch the image file.");
      return;
    }
    data.append("imageFile", file);


    try {
      axios.post("/books", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          showSuccess("Book successfully created!");
          onRefresh();
          closeModal();
        });
    } catch (error) {
      showError("Failed to create book");
      console.error("Error creating book:", error);
    }

  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth={"sm"}>
      <div className="header-container reverseColors">
        <FontAwesomeIcon
          className="absolute top-4 right-4 cursor-pointer"
          icon={faTimes}
          size="xl"
          onClick={closeModal}
        />
        <DialogContent>
          <div className="w-full break-normal text-center font-bold mb-5 mt-8">
            <p>
              Are you sure you want to clone book&nbsp;
              <span className="font-bold text-red-400">{title}</span>?
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={cloneBook} className="details-button">
              Yes
            </button>
            <button
              onClick={() => {
                onRefresh();
                closeModal();
              }}
              className="rent-button"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default CloneBookModalView;
