import {
  CalendarToday,
  CheckCircleOutline,
  HighlightOff,
  InfoOutlined,
  Person,
} from "@mui/icons-material";
import { Button, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
function ViewMovieDetailsModalWindow({ isModalOpen, closeModal, movie }) {
  const status = movie.isAvailable ? "Available" : "Unavailable";

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
        },
      }}
    >
      <DialogContent>
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            marginBottom: "2rem",
          }}
        >
          <img
            src={movie.photoUrl || "/default-movie.jpg"}
            alt={movie.title}
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
              {movie.title}
            </Typography>
            <Typography variant="subtitle1" style={{ color: "#ccc" }}>
              Directed by <span className="font-bold">{movie.director}</span>
            </Typography>
            <Typography variant="subtitle1" style={{ color: "#ccc" }}>
              Category <span className="font-bold">{movie.category}</span>
            </Typography>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <>
              <Typography
                variant="body1"
                style={{
                  marginBottom: "1.5rem", // Added more bottom margin for spacing
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InfoOutlined
                  style={{ marginRight: "0.75rem", color: "#B3B3B3" }} // Increased margin for better spacing
                />
                <span style={{ color: "#fff" }}>
                  About: {movie.description}
                </span>
              </Typography>

              <Typography
                variant="body1"
                style={{
                  marginBottom: "1.5rem", // Adjusted bottom margin for consistency
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {movie.isAvailable ? (
                  <CheckCircleOutline
                    style={{ marginRight: "0.75rem", color: "#46d369" }} // Increased margin for better spacing
                  />
                ) : (
                  <HighlightOff
                    style={{ marginRight: "0.75rem", color: "#e50914" }} // Increased margin for better spacing
                  />
                )}
                <span style={{ color: "#B3B3B3" }}>Status:</span>
                <span
                  style={{
                    color: movie.isAvailable ? "#46d369" : "#e50914",
                    marginLeft: "0.25rem",
                  }}
                >
                  {status}
                </span>
              </Typography>
            </>
            {!movie.isAvailable && (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <Typography
                    variant="body1"
                    style={{
                      color: "#B3B3B3",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Person
                      style={{ marginRight: "0.75rem", color: "#fff" }} // Increased margin for better spacing
                    />{" "}
                    Owned by:{" "}
                    <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                      {movie.owner_username}
                    </span>
                  </Typography>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <Typography
                    variant="body1"
                    style={{
                      color: "#B3B3B3",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Person
                      style={{ marginRight: "0.75rem", color: "#fff" }} // Increased margin for better spacing
                    />{" "}
                    Rented by:{" "}
                    <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                      {movie.rentedBy}
                    </span>
                  </Typography>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex gap-4">
                    <div style={{ marginBottom: "1.5rem" }}>
                      <Typography
                        variant="body2"
                        style={{
                          color: "#B3B3B3",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CalendarToday
                          style={{ marginRight: "0.75rem", color: "#fff" }} // Increased margin for better spacing
                        />{" "}
                        Rented on:{" "}
                        <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                          {dayjs(movie.rentedDate).format("MMMM D, YYYY")}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="body2"
                        style={{
                          color: "#B3B3B3",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CalendarToday
                          style={{ marginRight: "0.75rem", color: "#fff" }} // Increased margin for better spacing
                        />{" "}
                        Rented until:{" "}
                        <span style={{ color: "#fff", marginLeft: "0.25rem" }}>
                          {dayjs(movie.rentedUntil).format("MMMM D, YYYY")}
                        </span>
                      </Typography>
                    </div>
                  </div>
                </LocalizationProvider>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <div
        style={{ padding: "1rem", display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          onClick={closeModal}
          style={{
            backgroundColor: "#e50914",
            color: "#fff",
          }}
        >
          Close
        </Button>
      </div>
    </Dialog>
  );
}

export default ViewMovieDetailsModalWindow;
