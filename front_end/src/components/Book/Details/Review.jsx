import { Delete, Star, StarBorder, StarHalf, ExpandMore, ChevronRight } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography, Collapse, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { UserLoginContext } from "../../../utils/context/LoginProvider";
import Comment from "./Comment";
import ConfirmDeleteReviewModalWindow from "./ConfirmDeleteReviewModalWindow";

function Review({
  review,
  replyText,
  replyingTo,
  refreshData,
  owner_email,
  submitReply,
  setReplyText,
  handleReplyClick,
  handleDeleteReview,
}) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { isAdmin, email } = useContext(UserLoginContext);
  
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { id } = review;
  const hasComments = review.comments && review.comments.length > 0;

  return (
    <Box 
      key={id} 
      sx={{ 
        marginBottom: "2rem", 
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "#1e1e1e",
        border: "1px solid #333",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          padding: "0.5rem 1.5rem",
          backgroundColor: "#2a2a2a",
          border: "1px solid #444",
          display: "flex",
          flexDirection: "column",
          cursor: hasComments ? "pointer" : "default"
        }}
        onClick={hasComments ? handleExpandClick : undefined}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
            }}
          >
            {hasComments && (
              <IconButton
                size="small"
                sx={{ 
                  color: "#fff", 
                  marginRight: "0.5rem",
                  padding: "2px"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandClick();
                }}
              >
                {expanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            )}
            
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                marginRight: "1rem",
                color: "#fff !important"
              }}
            >
              {review.user.username}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#aaa !important",
                marginRight: "1rem",
              }}
            >
              {dayjs(review.created_date, "DD-MM-YYYY HH:mm:ss").format(
                "MMMM D, YYYY, h:mm A"
              ) || review.created_date}
            </Typography>

            {renderStars(review.rating)}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {(review.user.email === owner_email || isAdmin) && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDeleteDialog();
                }}
                sx={{ color: "#e50914", marginRight: "0.5rem" }}
              >
                <Delete />
              </IconButton>
            )}
            <Button
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                handleReplyClick(review);
              }}
              sx={{ fontSize: "0.75rem", color: "#1976D2" }}
            >
              Reply
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "1rem", width: "100%" }}>
          <Typography
            variant="body1"
            sx={{
              color: "#fff !important",
              wordWrap: "break-word",
              maxWidth: "100%",
            }}
          >
            {review.text || "No review text available."}
          </Typography>
        </Box>

        {replyingTo === id && (
          <Box
            sx={{
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
              onClick={() => submitReply(null, id)}
              disabled={!replyText.trim()}
              sx={{ fontSize: "0.75rem", marginTop: "0.5rem" }}
            >
              Submit Reply
            </Button>
          </Box>
        )}
      </Box>

      {/* Comments Section */}
      {hasComments && (
        <>
          <Divider sx={{ backgroundColor: "#444" }} />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ backgroundColor: "#1a1a1a", padding: "1rem" }}>
              {review.comments.map((comment, index) => (
                <Box key={comment.id}>
                  <Comment
                    comment={comment}
                    reviewId={id}
                    handleReplyClick={handleReplyClick}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    submitReply={submitReply}
                    userEmail={email}
                    isAdmin={isAdmin}
                    refreshData={refreshData}
                  />
                  {index < review.comments.length - 1 && (
                    <Divider sx={{ backgroundColor: "#333", margin: "0.5rem 0" }} />
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
        </>
      )}

      <ConfirmDeleteReviewModalWindow
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        confirmDelete={confirmDelete}
        description={
          " Are you sure you want to delete this review? This action cannot be undone."
        }
      />
    </Box>
  );
}

export default Review;