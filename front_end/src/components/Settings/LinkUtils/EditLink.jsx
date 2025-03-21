import { Box, Modal, TextField } from "@mui/material";
import React from "react";
function EditLink({
  modalOpen,
  handleCloseModal,
  currentLink,
  handleSave,
  handleModalChange,
}) {
  return (
    <Modal open={modalOpen} onClose={handleCloseModal} >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
        className="reverseColors"
      >
        <h2 className="text-xl font-semibold mb-4 ">Edit Link</h2>
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          required
          value={currentLink ? currentLink.name : ""}
          onChange={(e) => handleModalChange("name", e.target.value)}
          className="mb-4 "
          InputLabelProps={{ className: "text-white reverseColors" }}
          InputProps={{ className: "text-white reverseColors" }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          style={{ marginTop: 20 }}
          value={currentLink ? currentLink.description : ""}
          onChange={(e) => handleModalChange("description", e.target.value)}
          InputLabelProps={{ className: "text-white reverseColors" }}
          InputProps={{ className: "text-white reverseColors" }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="URL"
          required
          style={{ marginTop: 20 }}
          value={currentLink ? currentLink.url : ""}
          onChange={(e) => handleModalChange("url", e.target.value)}
          InputLabelProps={{ className: "text-white reverseColors" }}
          InputProps={{ className: "text-white reverseColors" }}
        />

        <div className="flex gap-x-2 mt-6">
          <button className="details-button" onClick={handleSave}>
            Save
          </button>
          <button
            className="details-button details-button-red"
            onClick={() => {
              handleCloseModal();
            }}
          >
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default EditLink;
