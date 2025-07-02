import { Delete, Reply } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { showError, showSuccess } from "../../../service/ToastService";
import ConfirmDeleteReviewModalWindow from "./ConfirmDeleteReviewModalWindow";

function Comment({
  comment,
  isAdmin,
  reviewId,
  replyText,
  userEmail,
  replyingTo,
  submitReply,
  setReplyText,
  refreshData,
  handleReplyClick,
  depth = 0,
}) {
  const { id, owner_email, createdDate, comment: message, children } = comment;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`/comments/${commentId}`)
      .then(() => {
        refreshData();
        showSuccess("Successfully deleted comment");
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const confirmDelete = () => {
    handleDeleteComment(id);
    handleCloseDeleteDialog();
  };

  return (
    <Box
      sx={{
        width:"auto",
        marginBottom: "1rem", 
        position: 'relative',
        paddingLeft: depth > 0 ? "1.5rem" : "0",
        borderLeft: depth > 0 ? "2px solid #555" : "none", 
      }}
    >
      <Box
        sx={{
          backgroundColor: "#2a2a2a",
          padding: "0.75rem 1rem", 
          borderRadius: "8px",
          border: "1px solid #444",
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            flexWrap: 'wrap', 
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#fff !important", flexGrow: 1 }}
          >
            {owner_email}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#aaa !important", display: "block", marginLeft: '1rem' }}
          >
            {dayjs(createdDate, "DD-MM-YYYY HH:mm:ss").format(
              "MMMM D, HH:mm A" // Format mai scurt pentru data
            ) || createdDate}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginLeft: '1rem' }}>
            {(userEmail === owner_email || isAdmin) && (
              <IconButton
                onClick={handleOpenDeleteDialog}
                sx={{ color: "#e50914", padding: "4px" }}
              >
                <Delete sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: "#e0e0e0", wordWrap: 'break-word' }}>
          {message}
        </Typography>

        <Button
          variant="text"
          startIcon={<Reply sx={{ color: "#1976D2" }} />}
          onClick={() => handleReplyClick(comment)}
          sx={{ fontSize: "0.75rem", color: "#1976D2", padding: "0.25rem 0" }}
        >
          Reply
        </Button>

        {replyingTo === id && (
          <Box
            sx={{
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
              sx={{
                backgroundColor: "#3a3a3a",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                '& .MuiOutlinedInput-root': {
                  color: '#e0e0e0',
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976D2',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#e0e0e0 !important',
                  fontSize: '0.875rem',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#aaa',
                  opacity: 1,
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitReply(id, reviewId)}
              disabled={!replyText.trim()}
              sx={{ fontSize: "0.75rem", marginTop: "0.5rem" }}
            >
              Submit Reply
            </Button>
          </Box>
        )}
      </Box>

      {children && children.length > 0 && (
        <Box sx={{
          // Nu mai adăugăm marginLeft aici, paddingLeft pe părinte gestionează asta
          marginTop: "0.75rem",
        }}>
          {children.map((childComment, index) => (
            <Comment
              key={childComment.id}
              comment={childComment}
              reviewId={reviewId}
              handleReplyClick={handleReplyClick}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              submitReply={submitReply}
              userEmail={userEmail}
              isAdmin={isAdmin}
              refreshData={refreshData}
              depth={depth + 1}
            />
          ))}
        </Box>
      )}

      <ConfirmDeleteReviewModalWindow
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        confirmDelete={confirmDelete}
        description={
          " Are you sure you want to delete this comment? This action cannot be undone."
        }
      />
    </Box>
  );
}

export default Comment;