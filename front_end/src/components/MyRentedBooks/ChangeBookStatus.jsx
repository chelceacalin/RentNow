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
  Tooltip
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
  renterEmail,
}) {
  const [status, setStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [statusError, setStatusError] = useState(false);
  const updateBookStatus = () => {
    if (!status) {
      setStatusError(true);
      showError("Please select a status.");
      return;
    }
    setStatusError(false);

    const url = `/books/updateStatus/${id}`;
    const emailDTO = {
      renterUsername: user.username,
      renterEmail: renterEmail,
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
            Please select the status for the book
            <span className="font-bold text-main-color"> {title}</span>
          </p>
        </div>

        <Box component="form" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal" error={statusError}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value);
                setStatusError(false);
              }}
              required
            >
              <MenuItem value="APPROVED">
                <Tooltip title="Approve book rental request" arrow>
                  <span>APPROVED</span>
                </Tooltip>
              </MenuItem>

              <MenuItem value="REJECTED">
                <Tooltip title="Reject book rental request" arrow>
                  <span>REJECTED</span>
                </Tooltip>
              </MenuItem>

              <MenuItem value="RETURNED">
                <Tooltip title="Approve book return" arrow>
                  <span>RETURNED</span>
                </Tooltip>
              </MenuItem>

              <MenuItem value="FAILED_RETURNING">
                <Tooltip title="Book was lost/destroyed" arrow>
                  <span>FAILED RETURNING</span>
                </Tooltip>
              </MenuItem>
            </Select>
            {statusError && (
              <Typography color="error" variant="body2">
                Status is required.
              </Typography>
            )}
          </FormControl>

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
          <button
            className="details-button db-sm"
            onClick={updateBookStatus}
            disabled={!status || status.length < 3}
          >
            Confirm
          </button>
          <button
            className="details-button details-button-red db-sm"
            onClick={() => {
              setStatus(" ");
              closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeBookStatus;
