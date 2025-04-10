import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showError } from "../../service/ToastService.jsx";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useUserContext } from "../../utils/context/UserContext.jsx";
import { useFetchData } from "../../utils/hooks/useFetchData.jsx";
import AppIcon from "../../utils/icons/AppIcon";
import BookNavItem from "./BookNavItem.jsx";
import CategoryManagementItem from "./CategoryManagementItem";
import LogoutNavItem from "./LogoutNavItem";
import ProfileNavItem from "./ProfileNavItem";
import RentedBooksNavItem from "./RentedBooksNavItem.jsx";
import RoleManagementItem from "./RoleManagementItem";
import SettingsItem from "./SettingsItem.jsx";
import "./css/Navbar.scss";
function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();
  let url = axios.defaults.baseURL;
  const { refreshImg, setRefreshImg } = useUserContext();
  const { isAdmin, setIsAdmin, setUsername, setToken, setIsLoggedIn, email } =
    useContext(UserLoginContext);

  const { data: user, error } = useFetchData(`/users/${email}`, [refreshImg]);

  if (error) {
    showError(`Error: ${error.message}`);
  }

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedItem("Books");
      setSelectedColor("Red");
    } else if (location.pathname.includes(`myprofile`)) {
      setSelectedItem("profile");
      setSelectedColor("red");
    } else if (
      location.pathname.substring(1, location.pathname.length) ===
      `myRentedBooks/${email}`
    ) {
      setSelectedItem("rentedBooks");
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
    <div className="flex w-auto navbar">
      <div className="flex flex-col h-full w-52 space-y-3 justify-between">
        {user && (
          <AppIcon
            isAdmin={isAdmin}
            user={user}
            setRefreshImg={setRefreshImg}
          />
        )}

        <div className="overflow-y-auto mt-10">
          <ul className="flex flex-col pt-2 pb-4 space-y-1 text-sm ">
            <BookNavItem
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
              navigate={navigate}
            />
            {isAdmin ? (
              <ProfileNavItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
              />
            ) : (
              <RentedBooksNavItem
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
                navigate={navigate}
                email={email}
              />
            )}

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
            <SettingsItem
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
              navigate={navigate}
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
  );
}

export default Navbar;
