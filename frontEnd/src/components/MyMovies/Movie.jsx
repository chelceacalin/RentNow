import Button from "@mui/material/Button";
import React from "react";
import DeleteMovieModalView from "./DeleteMovieModalView";
import DetailsMovieModalView from "./DetailsMovieModalView";

function Movie({
  title,
  director,
  category,
  isAvailable,
  rentedUntil,
  rentedBy,
  rating,
  classes,
  updateMovie,
  id,
  triggerRefresh,
  setTriggerRefresh,
}) {
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const handleDetailsOpen = () => setDetailsModalOpen(true);
  const handleDetailsClose = () => setDetailsModalOpen(false);
  const handleDeleteOpen = () => setDeleteModalOpen(true);
  const handleDeleteClose = () => setDeleteModalOpen(false);

  return (
    <tr key={title}>
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[250px]"
        >
          {title}
        </div>
      </td>
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[200px] break-words"
        >
          {director}
        </div>
      </td>
      <td className={classes}>
        <div variant="small" color="blue-gray" className="font-normal">
          {category}
        </div>
      </td>
      <td className={classes}>
        <div
          variant="small"
          style={{ color: isAvailable ? "green" : "red" }}
          className="font-normal"
        >
          {isAvailable ? "Available" : "Unavailable"}
        </div>
      </td>
      <td className={classes}>
        <div variant="small" color="blue-gray" className="font-normal">
          {!rentedUntil ? "N/A" : rentedUntil}
        </div>
      </td>
      <td className={classes}>
        <div variant="small" color="blue-gray" className="font-normal">
          {rentedBy == "available" && isAvailable ? "" : rentedBy}
        </div>
      </td>
      <td className={classes}>
        <Button
          onClick={handleDetailsOpen}
          className="outlined-button w-full font-normal"
          variant="outlined"
        >
          Details
        </Button>

        {detailsModalOpen && (
          <DetailsMovieModalView
            isModalOpen={detailsModalOpen}
            closeModal={handleDetailsClose}
            defaultTitle={title}
            defaultDirector={director}
            defaultCategory={category}
            id={id}
            isAvailable={isAvailable}
            setTriggerRefresh={setTriggerRefresh}
            triggerRefresh={triggerRefresh}
          />
        )}
      </td>
      <td className={classes}>
        <Button
          onClick={handleDeleteOpen}
          className="font-normal Button"
          variant="contained"
          disabled={!isAvailable}
        >
          Delete
        </Button>

        {deleteModalOpen && (
          <DeleteMovieModalView
            isModalOpen={deleteModalOpen}
            closeModal={handleDeleteClose}
            title={title}
            category={category}
            triggerRefresh={triggerRefresh}
            setTriggerRefresh={setTriggerRefresh}
            id={id}
          />
        )}
      </td>
    </tr>
  );
}

export default Movie;
