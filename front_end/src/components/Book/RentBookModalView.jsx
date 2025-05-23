import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../service/ToastService";

function RentBookModalView({
  book,
  refreshData,
  isRentModalOpen,
  handleCloseRentModal,
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

  const rentbook = () => {
    const url = "/books/history";

    let body = {
      rentedDate: today,
      rentedUntil: date,
      bookId: book.id,
      userId: idUser,
      description: book.description,
    };

    axios
      .post(url, body)
      .then(() => {
        showSuccess(`You have rented the book ${book.title}`);
        handleCloseRentModal();
        setTriggerRefresh(!triggerRefresh);
      })
      .catch((error) => {
        if (error.response) {
          const message = JSON.stringify(error.response.data).replace(/"/g, "");
          showError(message);
          if (message.includes("user")) {
            refreshData();
            handleCloseRentModal();
          }
        }
      });
  };
  return (
    <Dialog
      maxWidth={"md"}
      open={isRentModalOpen}
      onClose={handleCloseRentModal}
      PaperProps={{
        style: {
          backgroundColor: "#141414",
          color: "#fff",
          borderRadius: "8px",
        },
      }}
    >
      <FontAwesomeIcon
        className="closeModalWindowButton"
        icon={faTimes}
        onClick={handleCloseRentModal}
        transform="right-630 grow-6"
        style={{
          color: "#fff",
          cursor: "pointer",
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      />
      <DialogContent style={{ padding: "40px" }}>
        <Typography
          variant="h4"
          style={{ marginBottom: "20px", color: "#e50914" }}
        >
          Rent book: {book.title}
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: "20px", color: "#999" }}
        >
          You are renting{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            {book.title}
          </span>{" "}
          written by{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            {book.director}
          </span>{" "}
          from{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            {book.owner_username}
          </span>
          .
          <span className="mt-2 mb-4 flex align-content-center h-80 justify-center">
            <img
              src={book.photoUrl}
              alt="Image not found"
              width={550}
              height={550}
            />
          </span>
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: "40px", color: "#999" }}
        >
          Please select the return date below and pick up your book from the
          physical shelf or the owner.
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={<span style={{ color: "#fff" }}>Return date</span>}
              defaultValue={dayjs()}
              minDate={today}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  InputProps: {
                    style: { color: "#fff" },
                  },
                },
              }}
              sx={{
                width: { md: 259 },
                "& .MuiInputBase-root": {
                  color: "#fff",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e50914",
                    },
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#333",
                },
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
              }}
              disabled={false}
              selected={date}
              onChange={(date) => setDate(date)}
            />
          </LocalizationProvider>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleCloseRentModal} className="cancel-button">
            Cancel
          </button>
          <button className="rent-button" onClick={rentbook}>
            Rent
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RentBookModalView;
