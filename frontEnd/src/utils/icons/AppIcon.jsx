import React, { useState } from "react";
import EditRoleModalWindow from "../../components/RoleManagement/EditRoleModalWindow";
import "../../styles/variables.scss";
function AppIcon({ user, setRefreshImg }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className=" space-y-4 m-auto justify-center">
      <div className="font-bold mt-4 main-text-color text-2xl text-center">
        Rent Now
      </div>
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
