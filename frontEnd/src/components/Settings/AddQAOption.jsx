import { Box, Modal, TextField } from "@mui/material";
import React from "react";

function AddQAOption({
  addModalOpen,
  handleCloseAddModal,
  setNewQa,
  handleAddNewQa,
  newQa,
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
      >
        <h2 className="text-xl font-semibold mb-4">Add New Q&A Option</h2>
        <TextField
          fullWidth
          variant="outlined"
          label="Question"
          value={newQa.question}
          required
          onChange={(e) => setNewQa({ ...newQa, question: e.target.value })}
          className="mb-4"
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Answer"
          required
          style={{ marginTop: 20 }}
          value={newQa.answer}
          onChange={(e) => setNewQa({ ...newQa, answer: e.target.value })}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="details-button" onClick={handleAddNewQa}>
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

export default AddQAOption;
