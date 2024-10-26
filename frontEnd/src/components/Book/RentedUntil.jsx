import InfoIcon from "@mui/icons-material/Info";
import { Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";

function RentedUntil({ book }) {
  const rentedUntil = dayjs(book.rentedUntil, "DD-MM-YYYY");
  const now = dayjs();
  const hoursUntilRented = Math.abs(rentedUntil.diff(now, "hour"));

  const days = Math.floor(hoursUntilRented / 24);
  const hours = hoursUntilRented % 24;

  const isSameDayOrLess =
    rentedUntil.isSame(now, "day") || hoursUntilRented <= 48;

  const timeLeftText = rentedUntil.isSame(now, "day")
    ? `${hours} hour${hours !== 1 ? "s" : ""}`
    : `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
        hours !== 1 ? "s" : ""
      }`;

  return (
    <Typography variant="body2">
      Rented until:{" "}
      <span
        style={{
          color: isSameDayOrLess ? "orange" : "inherit",
          fontWeight: "bold",
        }}
      >
        {book.rentedUntil}
        <Tooltip title={`Time left: ${timeLeftText}`} arrow>
          <InfoIcon
            style={{
              color: "grey",
              verticalAlign: "middle",
              cursor: "pointer",
              height: "20px",
            }}
          />
        </Tooltip>
      </span>
    </Typography>
  );
}

export default RentedUntil;
