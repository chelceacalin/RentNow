import { Delete, Star, StarBorder, StarHalf } from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import Comment from "./Comment";

function Review({
  review,
  submitReply,
  handleReplyClick,
  setReplyText,
  replyText,
  replyingTo,
  owner_email,
  handleDeleteReview,
}) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <Box sx={{ display: "flex" }}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} sx={{ color: "#FFD700" }} />;
          } else if (i === fullStars && halfStar) {
            return <StarHalf key={i} sx={{ color: "#FFD700" }} />;
          } else {
            return <StarBorder key={i} sx={{ color: "#555" }} />;
          }
        })}
      </Box>
    );
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteReview(review.id);
    handleCloseDeleteDialog();
  };

  const { id } = review;

  return (
    <Box key={id} style={{ marginBottom: "2rem", width: "100%" }}>
      <TreeView
        defaultCollapseIcon={<span>−</span>}
        defaultExpandIcon={<span>+</span>}
        style={{
          borderRadius: "8px",
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          width: "100%",
        }}
      >
        <TreeItem
          nodeId={id}
          label={
            <div
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "8px",
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    className="text-main-bg"
                    style={{
                      fontWeight: "bold",
                      marginRight: "1rem",
                    }}
                  >
                    {review.user.username}
                  </Typography>

                  <Typography
                    variant="caption"
                    style={{
                      color: "#aaa",
                      marginRight: "1rem",
                    }}
                  >
                    {dayjs(review.created_date).format("MMMM D, YYYY, h:mm A")}
                  </Typography>

                  {renderStars(review.rating)}
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  {review.user.email === owner_email && (
                    <IconButton
                      onClick={handleOpenDeleteDialog}
                      style={{ color: "#e50914", marginRight: "0.5rem" }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                  <Button
                    variant="text"
                    onClick={() => handleReplyClick(review)}
                    style={{ fontSize: "0.75rem", color: "#1976D2" }}
                  >
                    Reply
                  </Button>
                </div>
              </div>

              <div style={{ marginTop: "1rem", width: "100%" }}>
                <Typography
                  variant="body1"
                  style={{
                    color: "#fff",
                    wordWrap: "break-word",
                    maxWidth: "100%",
                  }}
                >
                  {review.text || "No review text available."}
                </Typography>
              </div>
            </div>
          }
        >
          {replyingTo === id && (
            <Box
              style={{
                width: "100%",
                marginTop: "1rem",
                paddingLeft: "1rem",
                borderLeft: "3px solid #1976D2",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                multiline
                rows={2}
                style={{
                  backgroundColor: "#3a3a3a",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
                inputProps={{
                  style: { color: "#e0e0e0", fontSize: "0.875rem" },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => submitReply(null, id)}
                disabled={!replyText.trim()}
                style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}
              >
                Submit Reply
              </Button>
            </Box>
          )}

          {review.comments &&
            review.comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                reviewId={id}
                handleReplyClick={handleReplyClick}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                submitReply={submitReply}
              />
            ))}
        </TreeItem>
      </TreeView>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-x-2 mt-6">
            <button
              className="details-button"
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
    </Box>
  );
}

export default Review;
