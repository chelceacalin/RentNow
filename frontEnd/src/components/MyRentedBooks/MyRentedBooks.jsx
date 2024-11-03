import React, { useContext } from "react";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
import ChangeBookStatus from "./ChangeBookStatus.jsx";
import ReturnBookModal from "./ReturnBookModal.jsx";

function MyRentedBooks({
  classes,
  isAvailableForRenting,
  triggerRefresh,
  setTriggerRefresh,
  book,
}) {
  const {
    title,
    director,
    category,
    rentedUntil,
    rentedDate,
    owner_username,
    owner_email,
    id,
    status,
    renterEmail,
    bookHistoryId,
  } = book;

  const [returnModalOpen, setReturnModalOpen] = React.useState(false);
  const handleReturnOpen = () => setReturnModalOpen(true);
  const handleReturnClose = () => setReturnModalOpen(false);

  const { email, username, isAdmin } = useContext(UserLoginContext);

  const owner = {
    username: owner_username,
    email: owner_email,
  };

  const user = {
    email: email,
    username: username,
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-700";
      case "APPROVED":
        return "text-green-700";
      case "REJECTED":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <tr key={title} className={`${owner.email !== email ? "" : "bg-gray-100"}`}>
      {/* Common fields */}
      <td className={classes}>{title}</td>
      <td className={classes}>{director}</td>
      <td className={classes}>{category}</td>
      <td className={classes}>{rentedDate || "N/A"}</td>
      <td className={classes}>{rentedUntil || "N/A"}</td>

      {/* Conditional rendering for Admin and User */}
      {isAdmin ? (
        <>
          <td className={classes}>{renterEmail}</td>
          <td className={`${classes} ${getStatusColorClass(status)}`}>
            {status}
          </td>
          <td className={classes}>
            <button
              className="details-button"
              onClick={handleReturnOpen}
              disabled={status === "REJECTED"}
            >
              Change Status
            </button>
            <ChangeBookStatus
              id={id}
              isModalOpen={returnModalOpen}
              closeModal={handleReturnClose}
              title={title}
              triggerRefresh={triggerRefresh}
              setTriggerRefresh={setTriggerRefresh}
              owner={owner}
              user={user}
              bookHistoryId={bookHistoryId}
            />
          </td>
        </>
      ) : (
        <>
          <td className={classes}>{owner_username}</td>
          <td className={`${classes} ${getStatusColorClass(status)}`}>
            {status}
          </td>
          <td className={classes}>
            <button
              className="rent-button user-button"
              onClick={handleReturnOpen}
              disabled={status !== "APPROVED"}
            >
              Return Book
            </button>
            <ReturnBookModal
              id={id}
              isModalOpen={returnModalOpen}
              closeModal={handleReturnClose}
              title={title}
              triggerRefresh={triggerRefresh}
              setTriggerRefresh={setTriggerRefresh}
              owner={owner}
              user={user}
            />
          </td>
        </>
      )}
    </tr>
  );
}

export default MyRentedBooks;
