import { Box, Modal, TextField } from "@mui/material";
import React from "react";

function AddLink({
  newLink,
  setNewLink,
  addModalOpen,
  handleAddNewLink,
  handleCloseAddModal,
}) {
  return (
    <Modal open={addModalOpen} onClose={handleCloseAddModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
        className="reverseColors"
      >
        <h2 className="text-xl font-semibold mb-4 reverseColors">
          Add New Link
        </h2>
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          value={newLink.name}
          required
          onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
          className="mb-4"
          InputLabelProps={{ className: "text-white reverseColors" }}
          InputProps={{ className: "text-white reverseColors" }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          required
          style={{ marginTop: 20 }}
          value={newLink.description}
          onChange={(e) =>
            setNewLink({ ...newLink, description: e.target.value })
          }
          InputLabelProps={{ className: "text-white reverseColors" }}
          InputProps={{ className: "text-white reverseColors" }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="URL"
          required
          style={{ marginTop: 20 }}
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          InputLabelProps={{ className: "text-white reverseColors" }}
          InputProps={{ className: "text-white reverseColors" }}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="details-button" onClick={handleAddNewLink}>
            Save
          </button>
          <button
            className="details-button details-button-red"
            onClick={handleCloseAddModal}
          >
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default AddLink;
