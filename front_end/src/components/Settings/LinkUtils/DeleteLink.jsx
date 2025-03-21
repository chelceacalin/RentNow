import { Box, Modal } from "@mui/material";

import React from "react";

function DeleteLink({ deleteModalOpen, handleCloseDeleteModal, handleDelete }) {
  return (
    <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
         className="reverseColors"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this link?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <button className="details-button" onClick={handleDelete}>
            Confirm
          </button>
          <button
            className="details-button details-button-red"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default DeleteLink;
