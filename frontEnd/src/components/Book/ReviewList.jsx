import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

function ReviewList({ reviews, showReviews }) {
  return (
    <Collapse in={showReviews}>
      <List>
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ListItem
              key={index}
              style={{
                borderBottom: "1px solid #555",
                padding: "1rem",
                backgroundColor: "#1e1e1e",
              }}
            >
              <ListItemText
                primary={review.text}
                secondary={`Rating: ${review.rating} stars`}
                primaryTypographyProps={{ style: { color: "#fff" } }}
                secondaryTypographyProps={{ style: { color: "#bbb" } }}
              />
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
