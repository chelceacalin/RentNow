import React from "react";
import DeleteCategoryModalWindow from "./DeleteCategoryModalWindow";
import EditCategoryNameModalWindow from "./EditCategoryNameModalWindow";
function Category({
  category,
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
    handleClose();
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
          {category.name}
        </div>
      </td>
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[200px]"
        >
          {category.created_date}
        </div>
      </td>
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[200px]"
        >
          {category.updated_date}
        </div>
      </td>
      <td className={classes}>
        <button onClick={handleOpen} className="details-button db-sm">
          Edit
        </button>
        <EditCategoryNameModalWindow
          isModalOpen={open}
          closeModal={closeEditModal}
          id={category.id}
          name={category.name}
          updateCategory={updateCategory}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />

        <button
          className="details-button details-button-red db-sm"
          onClick={openEditModal}
        >
          Remove
        </button>
        <DeleteCategoryModalWindow
          isEditModalOpen={isEditModalOpen}
          closeEditModal={closeEditModal}
          name={category.name}
          id={category.id}
          setSignalCall={setSignalCall}
          signalCall={signalCall}
        />
      </td>
    </tr>
  );
}

export default Category;
