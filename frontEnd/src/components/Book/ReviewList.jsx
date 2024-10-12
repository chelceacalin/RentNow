import { Reply } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  ListItemText,
  TextField,
  TreeItem,
  TreeView,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function ReviewList({ reviews, showReviews, owner_email }) {
  const [replyingTo, setReplyingTo] = useState(null); // ID-ul comentariului la care răspunzi
  const [replyText, setReplyText] = useState(""); // Textul răspunsului

  // Funcția pentru gestionarea răspunsului la un comentariu
  const handleReplyClick = (comment) => {
    if (replyingTo === comment.id) {
      setReplyingTo(null);
    } else {
      setReplyingTo(comment.id);
    }
  };

  // Funcția care gestionează trimiterea unui reply
  const submitReply = (parentCommentId, reviewId) => {
    const commentAddDTO = {
      review_id: reviewId,
      owner_email: owner_email,
      comment: replyText,
      parent_comment_id: parentCommentId,
    };

    axios
      .post("/comments", commentAddDTO)
      .then(() => {
        showSuccess("Successfully replied to comment");
        clearForm();
      })
      .catch((err) => {
        showError(err.message);
        console.error(err);
      });
  };

  const clearForm = () => {
    setReplyText("");
    setReplyingTo(null);
  };

  // Funcție recursivă pentru a construi TreeItem pe baza comentariilor
  const renderCommentsAsTree = (comments, reviewId) => {
    if (!comments || comments.length === 0) {
      return null;
    }

    return comments.map((comment) => (
      <TreeItem
        key={comment.id}
        nodeId={comment.id}
        label={
          <Box>
            <Typography variant="subtitle2" style={{ color: "#FFD700" }}>
              {comment.ownerEmail}
            </Typography>
            <Typography variant="body2" style={{ color: "#fff" }}>
              {comment.comment}
            </Typography>
            <Typography variant="caption" style={{ color: "#bbb" }}>
              {dayjs(comment.createdDate).format("MMMM D, YYYY, h:mm A")}
            </Typography>

            {/* Butonul de reply */}
            <Button
              variant="text"
              startIcon={<Reply />}
              onClick={() => handleReplyClick(comment)}
              style={{ color: "#FFD700", fontSize: "0.75rem" }}
            >
              Reply
            </Button>

            {/* Formular de reply */}
            {replyingTo === comment.id && (
              <Box style={{ marginTop: "0.5rem" }}>
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
                  onClick={() => submitReply(comment.id, reviewId)}
                  disabled={!replyText.trim()}
                  style={{ fontSize: "0.75rem" }}
                >
                  Submit Reply
                </Button>
              </Box>
            )}
          </Box>
        }
      >
        {/* Recursiv afișăm sub-comentariile */}
        {comment.children.length > 0 &&
          renderCommentsAsTree(comment.children, reviewId)}
      </TreeItem>
    ));
  };

  return (
    <Collapse in={showReviews}>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <Box key={review.id} style={{ marginBottom: "2rem" }}>
            <Typography variant="subtitle2" className="text-main-color-b">
              {review.user.username}
            </Typography>
            <Typography variant="body2" style={{ color: "#bbb" }}>
              {dayjs(review.created_date).format("MMMM D, YYYY, h:mm A")}
            </Typography>
            <ListItemText
              primary={review.text}
              secondary={`Rating: ${review.rating} stars`}
              primaryTypographyProps={{
                style: { color: "#e0e0e0", marginBottom: "0.5rem" },
              }}
              secondaryTypographyProps={{ style: { color: "#aaa" } }}
            />

            {/* TreeView pentru comentarii */}
            {review.comments && review.comments.length > 0 && (
              <TreeView
                defaultCollapseIcon={<Reply />}
                defaultExpandIcon={<Reply />}
                style={{
                  backgroundColor: "#1a1a1a",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {renderCommentsAsTree(review.comments, review.id)}
              </TreeView>
            )}
          </Box>
        ))
      ) : (
        <Typography
          variant="body2"
          style={{ color: "#ccc", padding: "1rem", textAlign: "center" }}
        >
          No reviews available.
        </Typography>
      )}
    </Collapse>
  );
}

export default ReviewList;
