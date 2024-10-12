import React, { useState } from "react";
import EditRoleModalWindow from "./EditRoleModalWindow";
function User({
  user,
  updateUser,
  classes,
  setRefreshImg,
  isAdmin,
  isCurrentUser,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return <UserRow isCurrentUser={isCurrentUser} />;
  function UserRow({ isCurrentUser }) {
    return (
      <tr
        className={isCurrentUser ? "bg-gray-200" : "bg-white"}
        key={user.name}
      >
        <td className={classes}>
          <div className="flex items-center">
            {isCurrentUser && (
              <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2"></span>
            )}
            <span className="font-normal max-w-[200px]">{user.firstName}</span>
          </div>
        </td>

        <td className={classes}>
          <div className="font-normal max-w-[200px]">{user.lastName}</div>
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
          <button onClick={handleOpen} className="details-button reset-width">
            Edit
          </button>
          {open && (
            <EditRoleModalWindow
              isModalOpen={open}
              closeModal={handleClose}
              user={user}
              isAdmin={isAdmin}
              isCurrentUser={isCurrentUser}
              updateUser={updateUser}
              setRefreshImg={setRefreshImg}
            />
          )}
        </td>
      </tr>
    );
  }
}

export default User;
