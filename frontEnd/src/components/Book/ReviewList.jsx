import { Reply } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";

function ReviewList({ reviews, showReviews }) {
  return (
    <Collapse in={showReviews}>
      <List
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ListItem
              key={index}
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              >
                <Typography variant="subtitle2" className="text-main-color-b">
                  {review.user.username}
                </Typography>
                <Typography variant="caption" style={{ color: "#bbb" }}>
                  {dayjs(review.created_date).format("MMMM D, YYYY, h:mm A")}
                </Typography>
              </Box>
              <ListItemText
                primary={review.text}
                secondary={`Rating: ${review.rating} stars`}
                primaryTypographyProps={{
                  style: { color: "#e0e0e0", marginBottom: "0.5rem" },
                }}
                secondaryTypographyProps={{ style: { color: "#aaa" } }}
              />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  variant="text"
                  startIcon={<Reply className="text-main-color" />}
                  className="text-main-color "
                >
                  Reply
                </Button>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography
            variant="body2"
            style={{ color: "#ccc", padding: "1rem", textAlign: "center" }}
          >
            No reviews available.
          </Typography>
        )}
      </List>
    </Collapse>
  );
}

export default ReviewList;
