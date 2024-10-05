import React, { useState } from "react";
import EditRoleModalWindow from "./EditRoleModalWindow";
function User({ user, updateUser, classes }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <tr className="bg-white" key={user.name}>
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[200px]"
        >
          {user.username}
        </div>
      </td>
      <td className={classes}>
        <div
          variant="small"
          color="blue-gray"
          className="font-normal max-w-[200px]"
        >
          <span value="User" className="font-bold">
            {user.role}
          </span>
        </div>
      </td>
      <td className={classes}>
        <div variant="small" color="blue-gray" className="font-normal">
          {user.email}
        </div>
      </td>
      <td className={classes}>
        <div variant="small" color="blue-gray" className="font-normal">
          {user.is_active ? (
            <span className="text-available">Active</span>
          ) : (
            <span className="text-unavailable">Inactive</span>
          )}
        </div>
      </td>
      <td className={classes}>
        <button onClick={handleOpen} className="details-button">
          Edit
        </button>
        <EditRoleModalWindow
          isModalOpen={open}
          closeModal={handleClose}
          firstName={user.firstName}
          lastName={user.lastName}
          is_active={user.is_active}
          name={user.username}
          role={user.role}
          email={user.email}
          username={user.username}
          updateUser={updateUser}
        />
      </td>
    </tr>
  );
}

export default User;
