import React, { useState } from "react";
import EditRoleModalWindow from "../../components/RoleManagement/EditRoleModalWindow";
import "../../styles/variables.scss";
function AppIcon({ user, setRefreshImg }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-col items-center justify-center appIcon mt-4 space-y-4 w-full">
      <div className="font-bold main-text-color text-3xl">Rent Now</div>
      <div className="text-lg font-semibold">
        Hi,{" "}
        <span className="text-main-color cursor-pointer" onClick={handleOpen}>
          {" "}
          {user.username}
        </span>
      </div>
      <span
        className="bg-transparent hover:bg-transparent margin-0p5 cursor-pointer"
        onClick={handleOpen}
      >
        {user.photoUrl && (
          <div className="border rounded-full overflow-hidden w-32 h-32">
            <img
              src={user.photoUrl}
              alt="Selected"
              className="object-cover w-full h-full rounded-full"
            />
          </div>
        )}
      </span>
      {open && (
        <EditRoleModalWindow
          isModalOpen={open}
          closeModal={handleClose}
          user={user}
          isCurrentUser={true}
          updateUser={null}
          setRefreshImg={setRefreshImg}
        />
      )}
    </div>
  );
}

export default AppIcon;
