import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

function ViewMovieDetailsModalWindow({ isModalOpen, closeModal, movie }) {
  const STATUS_AVAILABLE = "Available";
  const STATUS_UNAVAILABLE = "Unavailable";
  const status = movie.isAvailable ? STATUS_AVAILABLE : STATUS_UNAVAILABLE;

  return (
    <Dialog
      maxWidth={"md"}
      open={isModalOpen}
      onClose={closeModal}
      className="movie-details-dialog"
    >
      <DialogContent>
        <Typography variant="h4" component="h2" className="movie-details-title">
          Movie Details
        </Typography>
        <Grid container spacing={2} className="movie-details-grid">
          <Grid item xs={12} md={6}>
            <TextField
              label="Movie title"
              defaultValue={movie.title}
              InputProps={{ readOnly: true }}
              className="movie-detail-field"
            />
            <TextField
              label="Director"
              defaultValue={movie.director}
              InputProps={{ readOnly: true }}
              className="movie-detail-field"
            />
            <TextField
              label="Category"
              defaultValue={movie.category}
              InputProps={{ readOnly: true }}
              className="movie-detail-field"
            />
            <TextField
              label="Description"
              defaultValue={movie.description}
              multiline
              rows={4}
              InputProps={{ readOnly: true }}
              className="movie-detail-field"
            />
            <TextField
              label="Status"
              defaultValue={status}
              InputProps={{ readOnly: true }}
              className={`movie-detail-field ${
                status === "Available" ? "" : "statusUnavailable"
              }`}
            />

            <TextField
              label="Rented by"
              defaultValue={movie.rentedBy}
              InputProps={{ readOnly: true }}
              className="movie-detail-field"
            />
          </Grid>
          <Grid item xs={12} md={6} className="movie-image-grid">
            <Card variant="outlined" className="movie-image-card">
              <CardMedia
                component="img"
                image={movie.photoUrl || "/default-movie.jpg"}
                alt="Movie Image"
              />
            </Card>
            {!movie.isAvailable && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="dp first"
                    label="Rented on"
                    value={dayjs(movie.rentedDate)}
                    readOnly
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="movie-detail-field"
                        InputLabelProps={{ style: { color: "#fff" } }}
                        inputProps={{
                          ...params.inputProps,
                          style: { color: "#fff" },
                        }}
                      />
                    )}
                  />
                  <DatePicker
                    label="Rented until"
                    className="dp"
                    value={dayjs(movie.rentedUntil)}
                    readOnly
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="movie-detail-field"
                        InputLabelProps={{ style: { color: "#fff" } }}
                        inputProps={{
                          ...params.inputProps,
                          style: { color: "#fff" },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <div className="movie-details-actions">
        <Button variant="contained" onClick={closeModal} className="redButton">
          Close
        </Button>
      </div>
    </Dialog>
  );
}

export default ViewMovieDetailsModalWindow;
