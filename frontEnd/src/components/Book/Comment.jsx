import { Reply } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

function Comment({ comment, handleReplySubmit }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleSubmitReply = () => {
    handleReplySubmit(comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <Box
      style={{ marginLeft: comment.parentId ? "2rem" : "0", marginTop: "1rem" }}
    >
      <Typography variant="body2" style={{ color: "#FFD700" }}>
        {comment.ownerEmail}
      </Typography>
      <Typography
        variant="body1"
        style={{ marginBottom: "0.5rem", color: "#fff" }}
      >
        {comment.comment}
      </Typography>

      {/* Butonul pentru reply */}
      <Button
        variant="text"
        startIcon={<Reply />}
        onClick={handleReplyClick}
        style={{ color: "#FFD700" }}
      >
        Reply
      </Button>

      {/* Formul de reply */}
      {isReplying && (
        <Box style={{ marginTop: "1rem" }}>
          <TextField
            fullWidth
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            variant="outlined"
            placeholder="Write your reply..."
            multiline
            rows={2}
            style={{
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
          >
            Submit Reply
          </Button>
        </Box>
      )}

      {/* Afișarea recursivă a sub-comentariilor */}
      {comment.children.length > 0 && (
        <Box>
          {comment.children.map((child) => (
            <Comment
              key={child.id}
              comment={child}
              handleReplySubmit={handleReplySubmit}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Comment;
