import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";
axios.defaults.withCredentials = true;

function ChangeBookStatus({
  isModalOpen,
  closeModal,
  title,
  id,
  setTriggerRefresh,
  triggerRefresh,
  owner,
  user,
  bookHistoryId,
}) {
  const [status, setStatus] = useState("PENDING");
  const [rejectReason, setRejectReason] = useState("");

  const updateBookStatus = () => {
    const url = `/books/updateStatus/${id}`;

    const emailDTO = {
      renterUsername: user.username,
      renterEmail: user.email,
      bookTitle: title,
      ownerEmail: owner.email,
      ownerUsername: owner.username,
      status: status,
      bookHistoryId: bookHistoryId,
      rejectReason: status === "REJECTED" ? rejectReason : null,
    };

    axios
      .put(url, emailDTO)
      .then(() => {
        showSuccess(
          `The status of the book ${title} has been updated to ${status}!`
        );
        setTriggerRefresh(!triggerRefresh);
        closeModal();
      })
      .catch((error) => {
        showError(error);
      });
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
            Please select the status for returning the book
            <span className="font-bold text-red-800"> {title}</span> to
            <span className="font-bold text-red-800"> {owner.username}</span>.
          </p>
        </div>

        <Box component="form" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>

          {/* Conditionally render the reject reason field */}
          {status === "REJECTED" && (
            <TextField
              label="Reason for Rejection"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              margin="normal"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          )}
        </Box>

        <div className="w-full mt-5">
          <button className="details-button db-sm" onClick={updateBookStatus}>
            Confirm
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

export default ChangeBookStatus;
