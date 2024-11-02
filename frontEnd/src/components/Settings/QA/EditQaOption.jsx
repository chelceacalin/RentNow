import { Box, Modal, TextField } from "@mui/material";
import React from "react";
function EditQaOption({
  modalOpen,
  handleCloseModal,
  currentQa,
  handleSave,
  handleModalChange,
}) {
  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
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
        <h2 className="text-xl font-semibold mb-4">Edit Q&A</h2>
        <TextField
          fullWidth
          variant="outlined"
          label="Question"
          required
          value={currentQa ? currentQa.question : ""}
          onChange={(e) => handleModalChange("question", e.target.value)}
          className="mb-4"
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Answer"
          required
          style={{ marginTop: 20 }}
          value={currentQa ? currentQa.answer : ""}
          onChange={(e) => handleModalChange("answer", e.target.value)}
        />

        <div className="flex gap-x-2 mt-6">
          <button
            className="details-button"
            onClick={handleSave}
          >
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

export default EditQaOption;
