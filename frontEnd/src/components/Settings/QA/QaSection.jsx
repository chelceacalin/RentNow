import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../service/ToastService";
import { useFetchData } from "../../../utils/hooks/useFetchData";
import AddQAOption from "./AddQAOption";
import DeleteQaOption from "./DeleteQaOption";
import EditQaOption from "./EditQaOption";

function QaSection() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const toggleRefresh = () => setTriggerRefresh((prev) => !prev);
  const { data, loaded } = useFetchData("/qa", [triggerRefresh]);
  const [qaList, setQaList] = useState([]);

  useEffect(() => {
    if (loaded && data) {
      setQaList(data);
    }
  }, [data, loaded]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentQa, setCurrentQa] = useState(null);
  const [newQa, setNewQa] = useState({ question: "", answer: "" });

  const handleOpenModal = (qa) => {
    setCurrentQa(qa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentQa(null);
  };

  const handleModalChange = (field, value) => {
    setCurrentQa((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentQa.question.trim() || !currentQa.answer.trim()) {
      showError("Question and Answer cannot be empty");
      return;
    }

    try {
      await axios.put("/qa", currentQa);
      showSuccess("Successfully updated the Q&A");
      toggleRefresh();
    } catch (error) {
      showError("Failed to save Q&A option");
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenDeleteModal = (qa) => {
    setCurrentQa(qa);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentQa(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/qa/${currentQa.id}`);
      showSuccess("Successfully deleted the Q&A");
      toggleRefresh();
    } catch (err) {
      showError("Failed to delete the Q&A");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewQa({ question: "", answer: "" });
  };

  const handleAddNewQa = async () => {
    if (!newQa.question.trim() || !newQa.answer.trim()) {
      showError("Question and Answer cannot be empty");
      return;
    }

    try {
      await axios.post("/qa", newQa);
      showSuccess("Successfully added a new Q&A");
      toggleRefresh();
    } catch (error) {
      showError("Failed to save Q&A option");
    } finally {
      handleCloseAddModal();
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography>Show/Hide Q&A Section</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <button
          onClick={handleOpenAddModal}
          className="close-button reset-margin-left reset-width mb-4 text-green-color text-white px-4 py-2 rounded"
        >
          Add Q&A Option
        </button>

        <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-300 w-full flex flex-col space-y-4">
          {qaList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No Q&A options available.
            </p>
          ) : (
            qaList.map((qa) => (
              <div
                key={qa.id}
                className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 ease-in-out"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-6">
                    <div>
                      <label className="block text-md font-semibold text-details-color">
                        Question:
                      </label>
                      <p className="mt-1 text-gray-800 text-sm overflow-auto">
                        {qa.question}
                      </p>
                    </div>
                    <div className="mt-3">
                      <label className="block text-md font-semibold text-details-color">
                        Answer:
                      </label>
                      <p className="mt-1 text-gray-800 text-sm overflow-auto">
                        {qa.answer}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 items-end">
                    <button
                      onClick={() => handleOpenModal(qa)}
                      className="px-3 py-1 details-button reset-width transition-colors font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(qa)}
                      className="px-3 py-1 rent-button reset-width transition-colors font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </AccordionDetails>

      <EditQaOption
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        currentQa={currentQa}
        handleSave={handleSave}
        handleModalChange={handleModalChange}
      />
      <DeleteQaOption
        deleteModalOpen={deleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDelete={handleDelete}
      />
      <AddQAOption
        addModalOpen={addModalOpen}
        handleCloseAddModal={handleCloseAddModal}
        setNewQa={setNewQa}
        handleAddNewQa={handleAddNewQa}
        newQa={newQa}
      />
    </Accordion>
  );
}

export default QaSection;
