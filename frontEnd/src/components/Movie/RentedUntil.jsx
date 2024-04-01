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

  const isSameDayOrLess =
    rentedUntil.isSame(now, "day") || hoursUntilRented <= 48;

  let timeLeftText;
  if (rentedUntil.isSame(now, "day")) {
    timeLeftText = `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    timeLeftText = `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
      hours !== 1 ? "s" : ""
    }`;
  }

  return (
    <Typography variant="body2">
      Rented until:{" "}
      <span
        style={{
          color: isSameDayOrLess ? "orange" : "inherit",
          fontWeight: "bold",
        }}
      >
        {movie.rentedUntil}
      </span>
      <Tooltip title={`Time left: ${timeLeftText}`} arrow>
        <InfoIcon
          style={{
            color: "rgba(0, 0, 0, 0.54)",
            marginLeft: "4px",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
        />
      </Tooltip>
    </Typography>
  );
}

export default RentedUntil;
