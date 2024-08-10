import {
  CalendarToday,
  CheckCircleOutline,
  Close,
  HighlightOff,
  InfoOutlined,
  Person,
} from "@mui/icons-material";
import {
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
          position: "relative",
          overflow: "hidden",
          display: "center",
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
          right: 8,
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
              Directed by{" "}
              <span style={{ fontWeight: "bold" }}>{movie.director}</span>
            </Typography>
            <Typography variant="subtitle1" style={{ color: "#ccc" }}>
              Category{" "}
              <span style={{ fontWeight: "bold" }}>{movie.category}</span>
            </Typography>
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
              <span>Description: {movie.description}</span>
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
              {movie.isAvailable ? (
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
                  color: movie.isAvailable ? "#46d369" : "#e50914",
                  marginLeft: "0.25rem",
                }}
              >
                {status}
              </span>
            </Typography>

            {!movie.isAvailable && (
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
                    {movie.owner_username}
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
                    {movie.rentedBy}

                    <Tooltip title={`Email: ${movie.owner_email}`}>
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
                        <InfoOutlined></InfoOutlined>
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
                        {dayjs(movie.rentedDate).format("MMMM D, YYYY")}
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
                        {dayjs(movie.rentedUntil).format("MMMM D, YYYY")}
                      </span>
                    </Typography>
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
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </div>
    </Dialog>
  );
}

export default ViewMovieDetailsModalWindow;
