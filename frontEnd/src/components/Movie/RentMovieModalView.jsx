import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Dialog, DialogContent} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import {useEffect, useState} from "react";
import {showError, showSuccess} from "../../service/ToastService";

function RentMovieModalView({
  isRentModalOpen,
  movie,
  setTriggerRefresh,
  triggerRefresh,
  handleCloseRentModal
}) {
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", { weekStart: 1 });

  const today = dayjs();
  const maxDate = today.add(14, "day");
  const [idUser, setIdUser] = useState(sessionStorage.getItem("id"));
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setIdUser(sessionStorage.getItem("id"));
  }, []);

  const rentMovie = () => {
    const url = "/movies/history";

    let body = {
      rentedDate: today,
      rentedUntil: date,
      movieId: movie.id,
      userId: idUser,
      description: movie.description
    };

    axios.post(url, body)
      .then(() => {
        showSuccess(`You have rented the movie ${movie.title}`);
        handleCloseRentModal();
        setTriggerRefresh(!triggerRefresh);
      })
      .catch((error) => {
        if (error.response) {
          const message = JSON.stringify(error.response.data).replace(/"/g, "");
          showError(message);
          if (message.includes("user")) {
            setTriggerRefresh(!triggerRefresh);
            handleCloseRentModal();
          }
        }
      });
  };
  return (
    <Dialog
      fullWidth
      maxWidth={"md"}
      open={isRentModalOpen}
      onClose={handleCloseRentModal}
    >
      <FontAwesomeIcon
        className="closeModalWindowButton"
        icon={faTimes}
        onClick={handleCloseRentModal}
        transform="right-630 grow-6"
      ></FontAwesomeIcon>
      <DialogContent>
        <p className="text-center">
          You are renting movie <span className="font-bold">  {movie.title} </span>
          directed by <span className="font-bold"> {movie.director} </span> from
          <span className="font-bold"> {movie.owner_username}</span>.
        </p>
        <p className="text-center">
          Please fill in the return date below and go pick up your movie from
          the physical shelf or the owner.
        </p>
        <div className="text-center pt-14">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={<span style={{ fontFamily: "Sanchez" }}>Return date</span>}
              defaultValue={dayjs()}
              minDate={today}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  inputProps: {
                    style: { fontFamily: "Sanchez" },
                  },
                },
              }}
              sx={{
                width: { md: 259 },
              }}
              disabled={false}
              selected={date}
              onChange={(date) => setDate(date)}
            />
          </LocalizationProvider>
        </div>
        <div className="pt-14 flex w-full">
          <div className="px-2 w-1/2">
            <Button
              className="outlined-button w-full"
              variant="outlined"
              onClick={handleCloseRentModal}
            >
              Cancel
            </Button>
          </div>
          <div className="px-2 w-1/2">
            <Button
                className="w-full darkButton"
              variant="contained"
              onClick={rentMovie}
            >
              Rent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RentMovieModalView;
