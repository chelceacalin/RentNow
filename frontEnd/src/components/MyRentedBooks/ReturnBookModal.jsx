import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { showError, showSuccess } from "../../service/ToastService";
import { useState } from "react";
axios.defaults.withCredentials = true;

function ReturnBookModal({
  isModalOpen,
  closeModal,
  title,
  id,
  setTriggerRefresh,
  triggerRefresh,
  owner,
  user,
}) {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState(5);
  const [text, setText] = useState("");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [leaveReview, setLeaveReview] = useState(false);

  const updateBookStatus = () => {
    let url = `/books/updateStatus/${id}`;

    if (leaveReview) {
      submitReview();
    }

    const emailDTO = {
      renterUsername: user.username,
      renterEmail: user.email,
      bookTitle: title,
      ownerEmail: owner.email,
      ownerUsername: owner.username,
    };

    axios
      .post(url, emailDTO)
      .then(() => {
        showSuccess(`The book ${title} has been returned!`);
        setTriggerRefresh(!triggerRefresh);
        closeModal();
      })
      .catch((error) => {
        showError(error);
      });
  };

  const submitReview = () => {
    let url = `/reviews`;

    const reviewAddDTO = {
      book_id: id,
      owner_email: user.email,
      rating: rating,
      state: state,
      text: text,
    };

    axios
      .post(url, reviewAddDTO)
      .then(() => {})
      .catch((_) => {});
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} maxWidth={"sm"}>
      <DialogContent>
        <FontAwesomeIcon
          className="closeModalWindowButton"
          icon={faTimes}
          onClick={closeModal}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            fontSize: "24px",
          }}
        />
        <div className="w-full break-normal text-center mb-5 mt-10">
          <p>
            Please note that you need to return the book to
            <span className="font-bold text-red-800"> {owner.username}</span>
          </p>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={leaveReview}
              onChange={(e) => {
                setLeaveReview(e.target.checked);
                setIsReviewFormOpen(e.target.checked);
              }}
              color="primary"
            />
          }
          label="I want to leave a review"
        />

        <Collapse in={isReviewFormOpen}>
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rating
            </Typography>
            <TextField
              type="number"
              label="Rating"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              fullWidth
              margin="normal"
              inputProps={{ step: 0.5, min: 0, max: 5 }}
            />

            <Typography variant="h6" gutterBottom>
              Book State
            </Typography>
            <TextField
              type="number"
              label="Book State"
              value={state}
              onChange={(e) => setState(parseFloat(e.target.value))}
              fullWidth
              margin="normal"
              inputProps={{ step: 0.5, min: 0, max: 5 }}
            />

            <TextField
              label="Review Text"
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        </Collapse>

        <div className="w-full mt-5">
          <button
            className="details-button db-sm"
            onClick={() => {
              updateBookStatus();
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
      </DialogContent>
    </Dialog>
  );
}

export default ReturnBookModal;
