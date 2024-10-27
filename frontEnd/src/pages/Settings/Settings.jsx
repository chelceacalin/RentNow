import React, { useState } from "react";
import AddQAOption from "../../components/Settings/AddQAOption";
import DeleteQaOption from "../../components/Settings/DeleteQaOption";
import EditQaOption from "../../components/Settings/EditQaOption";
import { showError, showSuccess } from "../../service/ToastService";

function Settings() {
  const [qaList, setQaList] = useState([
    { id: 1, question: "What is your name?", answer: "John Doe" },
    { id: 2, question: "What is your favorite color?", answer: "Blue" },
  ]);

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

  const handleSave = () => {
    if (!currentQa.question.trim() || !currentQa.answer.trim()) {
      showError("Question and Answer cannot be empty");
      return;
    }

    setQaList((prevQaList) =>
      prevQaList.map((qa) =>
        qa.id === currentQa.id
          ? { ...qa, question: currentQa.question, answer: currentQa.answer }
          : qa
      )
    );
    showSuccess("Successfully updated the Q&A");
    handleCloseModal();
  };

  const handleOpenDeleteModal = (qa) => {
    setCurrentQa(qa);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentQa(null);
  };

  const handleDelete = () => {
    setQaList((prevQaList) =>
      prevQaList.filter((qa) => qa.id !== currentQa.id)
    );
    showSuccess("Successfully deleted the Q&A");
    handleCloseDeleteModal();
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewQa({ question: "", answer: "" });
  };

  const handleAddNewQa = () => {
    if (!newQa.question.trim() || !newQa.answer.trim()) {
      showError("Question and Answer cannot be empty");
      return;
    }

    setQaList((prevQaList) => [
      ...prevQaList,
      { id: Date.now(), question: newQa.question, answer: newQa.answer },
    ]);
    showSuccess("Successfully added new Q&A");
    handleCloseAddModal();
  };

  return (
    <div className="w-full m-2">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Settings</h1>

      <button
        onClick={handleOpenAddModal}
        className="close-button reset-margin-left reset-width mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
                    <label className="block text-md font-semibold text-blue-700">
                      Question:
                    </label>
                    <p className="mt-1 text-gray-800 text-sm overflow-auto">
                      {qa.question}
                    </p>
                  </div>
                  <div className="mt-3">
                    <label className="block text-md font-semibold text-blue-700">
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
    </div>
  );
}

export default Settings;
