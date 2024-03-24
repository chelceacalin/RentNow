import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserLoginContext } from "../../utils/context/LoginProvider";

function MyProfileRiredirectButtons() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email } = useContext(UserLoginContext);

  const myMoviesClass =
    location.pathname.includes("myprofile") &&
    !location.pathname.includes("myRentedMovies")
      ? "aBackgroundClick text-white "
      : "bg-white text-black border-solid border-1 border-stone-950";
  const myRentedMoviesClass = location.pathname.includes("myRentedMovies")
    ? "aBackgroundClick text-white "
    : "bg-white text-black border-solid border-1 border-stone-950";
  return (
    <div className="flex">
      <button
        className={`p-4 w-60 border text-black  ${myMoviesClass}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/myprofile/${username}`);
        }}
      >
        My Movies
      </button>

      <button
        className={`p-4  w-60 border text-black  ${myRentedMoviesClass} ms-1`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/myprofile/myRentedMovies/${email}`);
        }}
      >
        My Rented Movies
      </button>
    </div>
  );
}

export default MyProfileRiredirectButtons;
