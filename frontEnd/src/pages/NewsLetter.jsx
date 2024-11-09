import { WarningAmber as WarningIcon } from "@mui/icons-material";
import { Card, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../service/ToastService";
function NewsLetter() {
  let navigate = useNavigate();
  const [token, setToken] = useState("");
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const extractedToken = pathSegments[pathSegments.length - 1];
    setToken(extractedToken);
  }, []);
  const handleUnsubscribe = () => {
    axios
      .post(`/newsletter/unsubscribe/${token}`)
      .then((res) => {
        showSuccess("You have successfully unsubscribed from the newsletter.");
      })
      .catch((e) => {
        console.error(e);
        showError(
          "Error unsubscribing from newsletter, token might be expired."
        );
      });
  };

  return (
    <div className="bg-blue-detail w-full h-screen flex items-center justify-center p-4 m-0">
      <Container maxWidth="sm" className="!m-0">
        <Card className="p-8 text-center shadow-2xl rounded-lg">
          <div className="flex justify-center mb-6">
            <WarningIcon className="text-yellow-500 text-6xl" />
          </div>
          <Typography
            variant="h4"
            className="mb-10 font-bold text-gray-800 w-auto"
          >
            Unsubscribe from RentNow Newsletter
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600 w-auto"
            style={{ marginTop: 20 }}
          >
            Are you sure you want to unsubscribe from our newsletter?
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600 w-auto"
            style={{ marginBottom: 25 }}
          >
            We’ll miss sharing the latest book recommendations and updates with
            you!
          </Typography>
          <div className="flex mb-4">
            <button
              variant="contained"
              onClick={handleUnsubscribe}
              className="rent-button"
            >
              Unsubscribe
            </button>
            <button
              variant="outlined"
              onClick={() => showSuccess("Great! You’re still subscribed.")}
              className="details-button"
            >
              Keep Me Subscribed
            </button>
          </div>
          <a
            onClick={() => {
              navigate("/login");
            }}
            className="mt-4 text-details-color"
          >
            Go to login page
          </a>
        </Card>
      </Container>
    </div>
  );
}

export default NewsLetter;
