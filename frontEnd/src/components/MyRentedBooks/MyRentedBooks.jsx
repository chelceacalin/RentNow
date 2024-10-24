import React, { useContext } from "react";
import ReturnBookModal from "./ReturnBookModal.jsx";
import { UserLoginContext } from "../../utils/context/LoginProvider.jsx";
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
  } = book;

  const owner = {
    username: owner_username,
    email: owner_email,
  };

  const [returnModalOpen, setReturnModalOpen] = React.useState(false);
  const handleReturnOpen = () => setReturnModalOpen(true);
  const handleReturnClose = () => setReturnModalOpen(false);
  const { email, username } = useContext(UserLoginContext);

  const user = {
    email: email,
    username: username,
  };

  return (
    <tr key={title} className={`${owner.email !== email ? "" : "bg-gray-100"}`}>
      <td className={classes}>
        <div
          color="blue-gray"
          className="font-normal max-w-[100px] break-words"
        >
          {title}
        </div>
      </td>
      <td className={classes}>
        <div
          color="blue-gray"
          className="font-normal max-w-[100px] break-words"
        >
          {director}
        </div>
      </td>
      <td className={classes}>
        <div
          color="blue-gray"
          className="font-normal max-w-[100px] break-words"
        >
          {category}
        </div>
      </td>
      <td className={classes}>
        <div
          color="blue-gray"
          className="font-normal max-w-[100px] break-words"
        >
          {!rentedDate ? "N/A" : rentedDate}
        </div>
      </td>
      <td className={classes}>
        <div
          color="blue-gray"
          className="font-normal max-w-[100px] break-words"
        >
          {!rentedUntil ? "N/A" : rentedUntil}
        </div>
      </td>
      <td className={classes}>
        <div
          color="blue-gray"
          className="font-normal max-w-[200px] break-words"
        >
          {owner_username}
        </div>
      </td>
      <td className={classes}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className="rent-button"
            disabled={isAvailableForRenting}
            onClick={handleReturnOpen}
          >
            Return book
          </button>
        </div>

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
    </tr>
  );
}

export default MyRentedBooks;
