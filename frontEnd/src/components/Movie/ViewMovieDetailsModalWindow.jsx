import { Button, Card, CardMedia, Dialog, DialogContent, Grid, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";

function ViewMovieDetailsModalWindow({
  isModalOpen,
  closeModal,
  title,
  category,
  director,
  isAvailable,
  rentedUntil,
  rentedBy,
  owner_username,
  rentedDate,
  description,
  photoUrl
}) {
  const STATUS_AVAILABLE = "Available";
  const STATUS_UNAVAILABLE = "Unavailable";
  const status = isAvailable ? STATUS_AVAILABLE : STATUS_UNAVAILABLE;

  return (
    <Dialog fullWidth maxWidth={"md"} open={isModalOpen} onClose={closeModal}>
      <div className="w-full">
        <h2 className="header-title my-6 flex justify-center text-2xl">Movie details</h2>
      </div>
      <DialogContent>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <div className="ml-20">
              <TextField
                id="movie-title"
                label="Movie title"
                defaultValue={title}
                sx={{ width: { md: 300 } }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="mt-6 ml-20">
              <TextField
                id="director"
                label="Director"
                defaultValue={director}
                sx={{ width: { md: 300 } }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="mt-6 ml-20">
              <TextField
                id="category"
                label="Category"
                defaultValue={category}
                sx={{ width: { md: 300 } }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="mt-6 ml-20">
              <TextField
                id="description"
                label="Description"
                defaultValue={description}
                multiline
                rows={4}
                sx={{ width: { md: 300 } }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="mt-6 ml-20">
              <TextField
                id="status"
                label="Status"
                defaultValue={status}
                sx={{ width: { md: 300 } }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="ml-20">
              <TextField
                id="owner"
                label="Owner"
                defaultValue={owner_username}
                sx={{ width: { md: 300 } }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="mt-6 ml-20">
              <Card
                variant="outlined"
                sx={{
                  width: { md: 300 },
                  height: { md: 345 },
                }}
              >
                <CardMedia
                  component="img"
                  image={photoUrl || "path/to/default/image"}
                  alt="Movie Image"
                />
              </Card>
            </div>
            {!isAvailable && (
              <>
                <div className="mt-6 ml-20">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Rented on"
                      value={dayjs(rentedDate)}
                      readOnly
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <div className="mt-6 ml-20">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Rented until"
                      value={dayjs(rentedUntil)}
                      readOnly
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <div className="mt-6 ml-20">
                  <TextField
                    id="rentedBy"
                    label="Rented by"
                    defaultValue={rentedBy}
                    sx={{ width: { md: 300 } }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <div className="flex justify-center my-4">
        <Button variant="contained" onClick={closeModal}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}

export default ViewMovieDetailsModalWindow;
