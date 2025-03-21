import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ConfirmDeleteReviewModalWindow({
  isDeleteDialogOpen,
  handleCloseDeleteDialog,
  confirmDelete,
  description
}) {
  return (
    <Dialog
      open={isDeleteDialogOpen}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" className="reverseColors">{"Confirm Deletion"}</DialogTitle>
      <DialogContent className="reverseColors">
        <DialogContentText id="delete-dialog-description" className="reverseColors">
         {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="reverseColors">
        <div className="flex gap-x-2 mt-6">
          <button
            className="details-button " 
            variant="contained"
            onClick={confirmDelete}
          >
            Confirm
          </button>
          <button
            className="details-button details-button-red"
            onClick={handleCloseDeleteDialog}
          >
            Cancel
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteReviewModalWindow;
