import {
  CalendarToday,
  CheckCircleOutline,
  HighlightOff,
  InfoOutlined,
  Person,
  Star,
  StarBorder,
  StarHalf,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import ReviewList from "./ReviewList";

function ViewBookDetailsModalWindow({
  isModalOpen,
  closeModal,
  book,
  setTriggerRefresh,
}) {
  const status = book.isAvailable ? "Available" : "Unavailable";
  const [showReviews, setShowReviews] = useState(false);

  const {
    photoUrl,
    title,
    director,
    description,
    isAvailable,
    category,
    owner_username,
    rentedBy,
    owner_email,
    rentedDate,
    rentedUntil,
  } = book;

  let { reviewAddResponseDTOS } = book;
  reviewAddResponseDTOS = reviewAddResponseDTOS.sort((a, b) => {
    return new Date(b.created_date) - new Date(a.created_date);
  });

  reviewAddResponseDTOS = reviewAddResponseDTOS.map((review) => {
    if (review.comments && review.comments.length > 0) {
      review.comments = review.comments.sort((a, b) => {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
    }
    return review;
  });

  const handleToggleReviews = () => {
    setShowReviews((prev) => !prev);
  };

  const averageRating = useMemo(() => {
    if (!reviewAddResponseDTOS || reviewAddResponseDTOS.length === 0) return 0;
    const totalRating = reviewAddResponseDTOS.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / reviewAddResponseDTOS.length;
  }, [reviewAddResponseDTOS]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} style={{ color: "#FFD700" }} />);
      } else if (i - rating < 1) {
        stars.push(<StarHalf key={i} style={{ color: "#FFD700" }} />);
      } else {
        stars.push(<StarBorder key={i} style={{ color: "#FFD700" }} />);
      }
    }
    return stars;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isModalOpen}
      onClose={closeModal}
      PaperProps={{
        style: {
          backgroundColor: "#141414",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      {/* Butonul de close */}
      <IconButton
        edge="end"
        color="inherit"
        onClick={closeModal}
        sx={{
          position: "absolute",
          top: 8,
          right: 16,
          color: "#fff",
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        {/* Imaginea */}
        <Box
          sx={{ position: "relative", pt: "56.25%", mb: 2, overflow: "hidden" }}
        >
          <img
            src={photoUrl || "/default-book.jpg"}
            alt={title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          {/* Overlay pentru text peste imagine */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 100%)",
              padding: "1rem",
            }}
          >
            <Typography
              variant="h4"
              sx={{ mb: "0.5rem", color: "rgb(255,0,0)" }}
            >
              {title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#ccc" }}>
              Directed by <span style={{ fontWeight: "bold" }}>{director}</span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#ccc" }}>
              Category <span style={{ fontWeight: "bold" }}>{category}</span>
            </Typography>

            <Typography sx={{ color: "#FFD700" }}>
              Average Rating: {averageRating.toFixed(1)} / 5
            </Typography>
            <Box>{renderStars(averageRating)}</Box>
          </Box>
        </Box>

        {/* Detalii suplimentare */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InfoOutlined sx={{ mr: 1, color: "#B3B3B3" }} />
              Description: {description}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isAvailable ? (
                <CheckCircleOutline sx={{ mr: 1, color: "#46d369" }} />
              ) : (
                <HighlightOff sx={{ mr: 1, color: "#e50914" }} />
              )}
              <span style={{ color: "#B3B3B3" }}>Status:</span>
              <span
                style={{
                  color: isAvailable ? "#46d369" : "#e50914",
                  marginLeft: "0.25rem",
                }}
              >
                {status}
              </span>
            </Typography>

            {!isAvailable && (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: "#B3B3B3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Person sx={{ mr: 1, color: "#fff" }} />
                  Owned by:{" "}
                  <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                    {owner_username}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: "#B3B3B3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Person sx={{ mr: 1, color: "#fff" }} />
                  Rented by:{" "}
                  <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                    {rentedBy}
                  </span>
                  <Tooltip title={`Email: ${owner_email}`}>
                    <IconButton
                      sx={{
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: "#fff",
                        marginLeft: "5px",
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: "flex", gap: "1rem", color: "#B3B3B3" }}>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CalendarToday sx={{ mr: 1, color: "#fff" }} />
                      Rented on:{" "}
                      <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                        {dayjs(rentedDate).format("MMMM D, YYYY")}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CalendarToday sx={{ mr: 1, color: "#fff" }} />
                      Rented until:{" "}
                      <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                        {dayjs(rentedUntil).format("MMMM D, YYYY")}
                      </span>
                    </Typography>
                  </Box>
                </LocalizationProvider>
              </>
            )}

            <Button
              variant="outlined"
              onClick={handleToggleReviews}
              sx={{
                mt: 2,
                color: "#fff",
                borderColor: "#fff",
                "&:hover": { borderColor: "#e50914", color: "#e50914" },
              }}
            >
              {showReviews ? "Hide Reviews" : "View Reviews"}
            </Button>
          </Grid>
        </Grid>

        {showReviews && (
          <ReviewList
            reviews={reviewAddResponseDTOS}
            showReviews={showReviews}
            owner_email={owner_email}
            setTriggerRefresh={setTriggerRefresh}
          />
        )}
      </DialogContent>

      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <button
          className="close-button"
          onClick={closeModal}
        >
          Close
        </button>
      </Box>
    </Dialog>
  );
}

export default ViewBookDetailsModalWindow;
