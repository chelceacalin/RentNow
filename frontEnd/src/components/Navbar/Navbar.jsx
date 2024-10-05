import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useUserContext } from "../../utils/context/UserContext.jsx";
import { useFetchData } from "../../utils/hooks/useFetchData.jsx";
import AppIcon from "../../utils/icons/AppIcon";
import BookNavItem from "./BookNavItem.jsx";
import CategoryManagementItem from "./CategoryManagementItem";
import LogoutNavItem from "./LogoutNavItem";
import ProfileNavItem from "./ProfileNavItem";
import RoleManagementItem from "./RoleManagementItem";
import "./css/Navbar.scss";
function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();
  let url = axios.defaults.baseURL;
  const { refreshImg, setRefreshImg } = useUserContext();
  const { isAdmin, setIsAdmin, setUsername, setToken, setIsLoggedIn, email } =
    useContext(UserLoginContext);

  const {
    data: user,
    error,
    loaded,
  } = useFetchData(`/users/${email}`, [refreshImg]);

  if (error) {
    showError(`Error: ${error.message}`);
  }

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedItem("Books");
      setSelectedColor("Red");
    } else if (location.pathname.includes("profile")) {
      setSelectedItem("profile");
      setSelectedColor("red");
    } else {
      setSelectedItem(location.pathname.substring(1, location.pathname.length));
      setSelectedColor("red");
    }
  }, [location.pathname]);

  const handleItemClick = (item, color) => {
    if (selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
      setSelectedColor(color);
    }
  };

  return (
    <div className="flex w-auto navbar ">
      <div className="flex flex-col h-full p-3 border-r-2 border-gray-100 w-60">
        <div className="flex flex-col h-full space-y-3 justify-between">
          <div className="flex items-center ml-2">
            {user && <AppIcon user={user} setRefreshImg={setRefreshImg} />}
          </div>

          <div className="overflow-y-auto mt-10">
            <ul className="flex flex-col pt-2 pb-4 space-y-1 text-sm ">
              <BookNavItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
              />
              <ProfileNavItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
              />

              <RoleManagementItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
                isAdmin={isAdmin}
              />

              <CategoryManagementItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
                isAdmin={isAdmin}
              />
            </ul>
          </div>
          <div className="mt-auto">
            <ul className="pt-2 pb-4 space-y-1 text-sm mt-10">
              <LogoutNavItem
                isAdmin={isAdmin}
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                setIsAdmin={setIsAdmin}
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setToken={setToken}
                url={url}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
