import { Button } from "@mui/material";
import React from "react";
import DeleteCategoryModalWindow from "./DeleteCategoryModalWindow";
import EditCategoryNameModalWindow from "./EditCategoryNameModalWindow";

function Category({
  id,
  name,
  classes,
  updateCategory,
  setErrorMessage,
  errorMessage,
  signalCall,
  setSignalCall,
}) {
  const [open, setOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSignalCall(!signalCall);
  };
  const openEditModal = () => setEditModalOpen(true);

  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setErrorMessage("");
    setOpen(false);
  };

  return (
    <tr className="z-0">
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[200px]"
        >
          {name}
        </div>
      </td>
      <td className="p-2">
        <Button
          onClick={handleOpen}
          variant="outlined"
        >
          Edit
        </Button>
        <EditCategoryNameModalWindow
          isModalOpen={open}
          closeModal={handleClose}
          id={id}
          name={name}
          updateCategory={updateCategory}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />

        <Button
           variant="contained"
          onClick={openEditModal}
        >
          Remove
        </Button>
        <DeleteCategoryModalWindow
          isEditModalOpen={isEditModalOpen}
          closeEditModal={closeEditModal}
          name={name}
          id={id}
          setSignalCall={setSignalCall}
          signalCall={signalCall}
        />
      </td>
    </tr>
  );
}

export default Category;
