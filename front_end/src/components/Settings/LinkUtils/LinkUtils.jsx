import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../service/ToastService";
import { useFetchData } from "../../../utils/hooks/useFetchData";
import AddLink from "./AddLink";
import DeleteLink from "./DeleteLink";
import EditLink from "./EditLink";
import RefreshIcon from '@mui/icons-material/Refresh';

function LinkUtils() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const toggleRefresh = () => setTriggerRefresh((prev) => !prev);
  const { data, loaded } = useFetchData("/links", [triggerRefresh]);
  const [linkList, setLinkList] = useState([]);

  useEffect(() => {
    if (loaded && data) {
      const updatedData = data.map((link) => ({
        ...link,
        showUrl: false,
      }));
      setLinkList(updatedData);
    }
  }, [data, loaded]);

  const toggleUrlVisibility = (id) => {
    setLinkList((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id ? { ...link, showUrl: !link.showUrl } : link
      )
    );
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [newLink, setNewLink] = useState({
    name: "",
    description: "",
    url: "",
  });

  const handleOpenModal = (link) => {
    setCurrentLink(link);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentLink(null);
  };

  const handleModalChange = (field, value) => {
    setCurrentLink((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentLink.name.trim() || !currentLink.url.trim()) {
      showError("Name or URL cannot be empty");
      return;
    }

    try {
      await axios.put("/links", currentLink);
      showSuccess("Successfully updated the link");
      toggleRefresh();
    } catch (error) {
      showError("Failed to save link");
    } finally {
      handleCloseModal();
    }
  };

  const handleRefreshLinks=()=>{
    axios.get("/links/load")
    .then((data)=>{
      showSuccess("Successfully refreshed default links");
     
    })
    .catch((error)=>{
      showError("Failed to refresh default links");
    })
  }

  const handleOpenDeleteModal = (link) => {
    setCurrentLink(link);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentLink(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/links/${currentLink.id}`);
      showSuccess("Successfully deleted the link");
      toggleRefresh();
    } catch (err) {
      showError("Failed to delete the link");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewLink({ name: "", description: "", url: "" });
  };

  const handleAddNewLink = async () => {
    if (!newLink.name.trim() || !newLink.url.trim()) {
      showError("Name and URL cannot be empty!");
      return;
    }

    try {
      await axios.post("/links", newLink);
      showSuccess("Successfully added a new link");
      toggleRefresh();
    } catch (error) {
      showError("Failed to save link");
    } finally {
      handleCloseAddModal();
    }
  };

  return (
    <Accordion className="reverseColors">
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography>Show/Hide Util Links Section</Typography>

       
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex justify-between w-full">
        <button
          onClick={handleOpenAddModal}
          className="close-button reset-margin-left reset-width mb-4 text-green-color text-white px-4 py-2 rounded"
        >
          Add Link
        </button>
        <RefreshLinks handleRefreshLinks={handleRefreshLinks}/>
        </div>
        <table className="bg-gray-50 w-full border-collapse border border-gray-300 rounded-lg shadow-md reverseColors">
          <thead className="reverseColors">
            <tr className="bg-gray-100 border-b reverseColors">
              <th className="px-2 py-3 text-left font-semibold text-xs">
                Name
              </th>

              <th className="px-2 py-3 text-left font-semibold text-xs">
                Description
              </th>
              <th className="px-2 py-3 text-left font-semibold text-xs">URL</th>
              <th className="px-2 py-3 text-left font-semibold text-xs">
                URL TYPE
              </th>
              <th className="px-2 py-3 text-left font-semibold text-xs">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {linkList.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-gray-500 text-center py-4 reverseColors"
                >
                  No links available.
                </td>
              </tr>
            ) : (
              linkList.map((link) => {
                const internalLink = !link.url.includes("http");
                return (
                  <tr
                    key={link.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td
                      onClick={() => {
                        window.open(
                          link.url,
                          internalLink ? "_self" : "_blank"
                        );
                      }}
                      className="px-2 py-3 text-blue-500 font-bold cursor-pointer underline"
                    >
                      {link.name}
                    </td>

                    <td className="px-2 py-3 ">
                      <span className="reverseColors">  {link.description}</span>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => toggleUrlVisibility(link.id)}
                        className="ml-2 text-xs  reverseColors font-bold underline"
                      >
                        {internalLink ? "" : link.showUrl ? "Hide" : "Show"}
                      </button>
                      <span className="reverseColors ms-2">
                        {internalLink
                          ? link.url
                          : link.showUrl
                          ? link.url
                          : "●●●●●●●●●●"}
                      </span>
                    </td>
                    <td
                      className={`px-2 py-3 font-bold ${
                        internalLink ? "text-green-color" : "text-main-color"
                      }`}
                    >
                      {internalLink ? "INTERNAL" : "EXTERNAL"}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenModal(link)}
                          className="details-button medium-sm long"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(link)}
                          className="rent-button medium-sm long"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </AccordionDetails>

      <AddLink
        newLink={newLink}
        setNewLink={setNewLink}
        addModalOpen={addModalOpen}
        handleAddNewLink={handleAddNewLink}
        handleCloseAddModal={handleCloseAddModal}
      />

      <EditLink
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        handleSave={handleSave}
        currentLink={currentLink}
        handleModalChange={handleModalChange}
      />

      <DeleteLink
        deleteModalOpen={deleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDelete={handleDelete}
      />
    </Accordion>
  );
}

function RefreshLinks({handleRefreshLinks}) {

  return (
    <div className="flex items-center" onClick={handleRefreshLinks}>
      <RefreshIcon 
        onClick={() => {  }} 
        style={{ cursor: 'pointer' }} 
      />
      <span style={{ marginRight: '8px' }}>Refresh</span>
    </div>
  );
}

export default LinkUtils;
