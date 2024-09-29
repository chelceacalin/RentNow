import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserLoginContext } from "../../utils/context/LoginProvider";

function MyProfileRedirectButtons() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email } = useContext(UserLoginContext);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex">
      <button
        className={`p-4 w-60 border ${
          isActive("myprofile") && !isActive("myRentedBooks")
            ? "bg-main-color text-white"
            : "bg-white-text-black"
        }`}
        onClick={() => navigate(`/myprofile/${username}`)}
      >
        My Books
      </button>
      <button
        className={`p-4 w-60 border ml-1 ${
          isActive("myRentedBooks")
            ? "bg-main-color text-white"
            : "bg-white-text-black"
        }`}
        onClick={() => navigate(`/myprofile/myRentedBooks/${email}`)}
      >
        My Rented Books
      </button>
    </div>
  );
}

export default MyProfileRedirectButtons;
