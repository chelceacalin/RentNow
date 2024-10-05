import React, { useState } from "react";
import EditRoleModalWindow from "./EditRoleModalWindow";
function User({ user, updateUser, classes, myUserEmail }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const isCurrentUser = myUserEmail === user.email;

  return <UserRow isCurrentUser={isCurrentUser} />;
  function UserRow({ isCurrentUser }) {
    return (
      <tr
        className={isCurrentUser ? "bg-gray-200" : "bg-white"}
        key={user.name}
      >
        <td className={classes}>
          <div className="font-normal max-w-[200px]">
            {user.username}
            {isCurrentUser && (
              <span className="ml-2 h-3 w-3 bg-green-500 rounded-full inline-block"></span>
            )}
          </div>
        </td>
        <td className={classes}>
          <div className="font-normal max-w-[200px]">
            <span value="User" className="font-bold">
              {user.role}
            </span>
          </div>
        </td>
        <td className={classes}>
          <div className="font-normal">{user.email}</div>
        </td>
        <td className={classes}>
          <div className="font-normal">
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
          {open && (
            <EditRoleModalWindow
              isModalOpen={open}
              closeModal={handleClose}
              user={user}
              isCurrentUser={isCurrentUser}
              updateUser={updateUser}
            />
          )}
        </td>
      </tr>
    );
  }
}

export default User;
