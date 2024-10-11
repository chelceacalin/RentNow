import {
  CalendarToday,
  CheckCircleOutline,
  Close,
  HighlightOff,
  InfoOutlined,
  Person,
  Star,
  StarBorder,
  StarHalf,
} from "@mui/icons-material";
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
import ReviewList from "./ReviewList"; // Import the ReviewList component

function ViewBookDetailsModalWindow({ isModalOpen, closeModal, book }) {
  const status = book.isAvailable ? "Available" : "Unavailable";
  const [showReviews, setShowReviews] = useState(false);

  const {
    reviewAddResponseDTOS,
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
      <IconButton
        edge="end"
        color="inherit"
        onClick={closeModal}
        style={{
          position: "absolute",
          top: 8,
          right: 24,
          color: "#fff",
        }}
      >
        <Close />
      </IconButton>

      <DialogContent>
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            marginBottom: "2rem",
            overflow: "hidden",
          }}
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
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 100%)",
              padding: "2rem",
            }}
          >
            <Typography
              variant="h3"
              style={{ marginBottom: "0.5rem", color: "rgb(255,0,0)" }}
            >
              {title}
            </Typography>
            <Typography variant="subtitle1" style={{ color: "#ccc" }}>
              Directed by <span style={{ fontWeight: "bold" }}>{director}</span>
            </Typography>
            <Typography variant="subtitle1" style={{ color: "#ccc" }}>
              Category <span style={{ fontWeight: "bold" }}>{category}</span>
            </Typography>

            <Typography style={{ color: "#FFD700" }}>
              Average Rating: {averageRating.toFixed(1)} / 5
            </Typography>
            <Box>{renderStars(averageRating)}</Box>
          </div>
        </div>

        <Grid container spacing={2} height={"auto"}>
          <Grid item xs={12} md={8} lg={12}>
            <Typography
              variant="body1"
              style={{
                marginBottom: "1rem",
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InfoOutlined
                style={{ marginRight: "0.75rem", color: "#B3B3B3" }}
              />
              <span>Description: {description}</span>
            </Typography>

            <Typography
              variant="body1"
              style={{
                marginBottom: "1rem",
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isAvailable ? (
                <CheckCircleOutline
                  style={{ marginRight: "0.75rem", color: "#46d369" }}
                />
              ) : (
                <HighlightOff
                  style={{ marginRight: "0.75rem", color: "#e50914" }}
                />
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
                  style={{
                    marginBottom: "1rem",
                    color: "#B3B3B3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Person style={{ marginRight: "0.75rem", color: "#fff" }} />
                  Owned by:{" "}
                  <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                    {owner_username}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    marginBottom: "1rem",
                    color: "#B3B3B3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Person style={{ marginRight: "0.75rem", color: "#fff" }} />
                  Rented by:{" "}
                  <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                    {rentedBy}
                    <Tooltip title={`Email: ${owner_email}`}>
                      <IconButton
                        style={{
                          width: "1rem",
                          height: "1rem",
                          backgroundColor: "white",
                          marginLeft: "5px",
                          top: "0px",
                          marginBottom: "2px",
                        }}
                      >
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
                  </span>
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#B3B3B3",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarToday
                        style={{ marginRight: "0.75rem", color: "#fff" }}
                      />
                      Rented on:{" "}
                      <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                        {dayjs(rentedDate).format("MMMM D, YYYY")}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#B3B3B3",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarToday
                        style={{ marginRight: "0.75rem", color: "#fff" }}
                      />
                      Rented until:{" "}
                      <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                        {dayjs(rentedUntil).format("MMMM D, YYYY")}
                      </span>
                    </Typography>
                  </div>
                </LocalizationProvider>
              </>
            )}

            <Button
              variant="outlined"
              onClick={handleToggleReviews}
              style={{
                marginBottom: "1rem",
                marginTop: "1rem",
                color: "#fff",
                borderColor: "#fff",
              }}
            >
              {showReviews ? "Hide Reviews" : "View Reviews"}
            </Button>

            {showReviews && (
              <ReviewList
                reviews={reviewAddResponseDTOS}
                showReviews={showReviews}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <div
        style={{ padding: "1rem", display: "flex", justifyContent: "flex-end" }}
      >
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </div>
    </Dialog>
  );
}

export default ViewBookDetailsModalWindow;
