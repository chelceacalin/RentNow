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
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import ReviewList from "./ReviewList";

function ViewBookDetailsModalWindow({
  book,
  closeModal,
  isModalOpen,
  refreshData,
}) {
  const [showReviews, setShowReviews] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(book);
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
    renterEmail,
  } = selectedBook;

  useEffect(() => {
    setSelectedBook(book);
  }, [book]);

  useEffect(() => {
    if (category) {
      axios
        .get(`/books/extended?category=${category}`)
        .then((res) => {
          const filteredBooks = res.data.content.filter(
            (recommendedBook) => recommendedBook.id !== book.id
          );
          const shuffledBooks = shuffleArray(filteredBooks);

          setRecommendedBooks(shuffledBooks.slice(0, 3));
        })
        .catch((error) => {
          console.error("Failed to fetch recommended books: ", error);
        });
    }
  }, [category]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  let { reviewAddResponseDTOS } = selectedBook;
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

  const handleBookClick = (recommendedBook) => {
    setSelectedBook(recommendedBook);
    setShowReviews(false);
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

      <Grid container>
        <Grid item xs={8}>
          <BookDetails
            photoUrl={photoUrl}
            title={title}
            director={director}
            description={description}
            isAvailable={isAvailable}
            category={category}
            owner_username={owner_username}
            rentedBy={rentedBy}
            owner_email={owner_email}
            rentedDate={rentedDate}
            rentedUntil={rentedUntil}
            averageRating={averageRating}
            renderStars={renderStars}
            handleToggleReviews={handleToggleReviews}
            showReviews={showReviews}
            reviewAddResponseDTOS={reviewAddResponseDTOS}
            refreshData={refreshData}
          />
        </Grid>
        {RecommendedBooks()}
      </Grid>
    </Dialog>
  );

  function RecommendedBooks() {
    return (
      <Grid item xs={4}>
        <Box
          sx={{
            padding: "16px",
            borderLeft: "1px solid #333",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ color: "#FFD700", mb: 2 }}>
            Recommended Books
          </Typography>
          <Box>
            {recommendedBooks.map((recommendedBook, idx) => (
              <Box
                key={idx}
                onClick={() => handleBookClick(recommendedBook)}
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  color: "#000",
                  p: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <img
                  src={recommendedBook.photoUrl || "/default-book.jpg"}
                  alt={recommendedBook.title}
                  style={{
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {recommendedBook.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    );
  }

  function BookDetails({
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
    averageRating,
    renderStars,
    handleToggleReviews,
    showReviews,
    reviewAddResponseDTOS,
    refreshData,
  }) {
    let [toggleDescription, setToggleDescription] = useState(
      description != null && description.length > 400
    );
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imageUrl) => {
      setSelectedImage(imageUrl);
      setIsImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
      setIsImageModalOpen(false);
      setSelectedImage(null);
    };
    return (
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            position: "relative",
            pt: "56.25%",
            mb: 2,
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
              objectFit: "contain",
              borderRadius: "8px",
            }}
            onClick={() => handleImageClick(photoUrl || "/default-book.jpg")}
          />

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
              variant="h6"
              sx={{ mb: "0rem", color: "rgb(255,0,0)" }}
              className="flex max-w-max bg-black bg-opacity-10 w-2/5"
            >
              {title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#ccc" }}>
              Written by <span style={{ fontWeight: "bold" }}>{director}</span>
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

        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <div className="flex">
              <InfoOutlined
                className="text-gray-400 hover:text-gray-600"
                sx={{ mr: 1, color: "#B3B3B3" }}
                onClick={() => setToggleDescription((prev) => !prev)}
              />

              {!toggleDescription ? (
                <Box
                  sx={{
                    width: "auto",
                    maxHeight: 200,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  Description: {description}
                </Box>
              ) : (
                <span
                  onClick={() => {
                    setToggleDescription((prev) => !prev);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Show description
                </span>
              )}
            </div>

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            ></Typography>

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
                {isAvailable ? "Available" : "Unavailable"}
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
                  <Tooltip title={`Email: ${renterEmail}`}>
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
              onClick={(event) => {
                event.stopPropagation();
                handleToggleReviews();
              }}
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
            refreshData={refreshData}
          />
        )}

        <div>
          <Dialog
            open={isImageModalOpen}
            onClose={handleCloseImageModal}
            maxWidth="md"
            fullWidth
          >
            <DialogContent sx={{ padding: 0 }}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseImageModal}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 16,
                  color: "#fff",
                }}
              >
                <CloseIcon />
              </IconButton>
              <img
                src={selectedImage}
                alt={title}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    );
  }
}

export default ViewBookDetailsModalWindow;
