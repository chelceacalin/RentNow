import React from "react";
import { Typography, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import InfoIcon from "@mui/icons-material/Info";

function RentedUntil({ movie }) {
  const rentedUntil = dayjs(movie.rentedUntil);
  const now = dayjs();
  const hoursUntilRented = Math.abs(rentedUntil.diff(now, "hour"));

  const days = Math.floor(hoursUntilRented / 24);
  const hours = hoursUntilRented % 24;

  const isSameDayOrLess = rentedUntil.isSame(now, "day") || hoursUntilRented <= 48;

  const timeLeftText = rentedUntil.isSame(now, "day")
    ? `${hours} hour${hours !== 1 ? "s" : ""}`
    : `${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""}`;

  return (
    <Typography variant="body2">
      Rented until:{" "}
      <span
        style={{
          color: isSameDayOrLess ? "orange" : "inherit",
          fontWeight: "bold",
        }}
      >
        {rentedUntil.format("MMM D, YYYY h:mm A")}
        <Tooltip title={`Time left: ${timeLeftText}`} arrow>
        <InfoIcon
          style={{
            color: "grey",
            verticalAlign: "middle",
            cursor: "pointer",
            height: "20px"
          }}
        />
      </Tooltip>
      </span>
      {movie.rentedBy && (
        <Typography variant="body2" style={{ marginTop: "4px", fontStyle: "italic" }}>
          Rented by: {movie.rentedBy}
        </Typography>
      )}
    
    </Typography>
  );
}

export default RentedUntil;
