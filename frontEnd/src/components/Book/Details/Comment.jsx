import { Reply } from "@mui/icons-material";
import { TreeItem } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";

function Comment({
  comment,
  reviewId,
  handleReplyClick,
  replyingTo,
  replyText,
  setReplyText,
  submitReply,
}) {
  return (
    <TreeItem
      nodeId={comment.id}
      label={
        <Box
          sx={{
            backgroundColor: "#2a2a2a",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "1px solid #444",
            width: "95%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <Typography
              variant="subtitle2"
              className="text-main-bg"
              sx={{ fontWeight: "" }}
            >
              {comment.owner_email}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#888", display: "block" }}
            >
              {dayjs(comment.createdDate).format("MMMM D, YYYY, h:mm A")}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#fff" }}>
            {comment.comment}
          </Typography>

          <Button
            variant="text"
            startIcon={<Reply sx={{ color: "#1976D2" }} />}
            onClick={() => handleReplyClick(comment)}
            sx={{ fontSize: "0.75rem", color: "#1976D2", padding: "0.25rem 0" }}
          >
            Reply
          </Button>

          {replyingTo === comment.id && (
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
                sx={{ fontSize: "0.75rem", marginTop: "0.5rem" }}
              >
                Submit Reply
              </Button>
            </Box>
          )}
        </Box>
      }
    >
      {comment.children &&
        comment.children.length > 0 &&
        comment.children.map((childComment) => (
          <Comment
            key={childComment.id}
            comment={childComment}
            reviewId={reviewId}
            handleReplyClick={handleReplyClick}
            replyingTo={replyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            submitReply={submitReply}
          />
        ))}
    </TreeItem>
  );
}

export default Comment;
