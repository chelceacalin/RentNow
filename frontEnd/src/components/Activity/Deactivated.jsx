import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserLoginContext } from "../../utils/context/LoginProvider";
function Deactivated() {
  const navigate = useNavigate();
  const { setIsAdmin, setUsername, setToken, setIsLoggedIn } =
    useContext(UserLoginContext);

  const logout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    setUsername(null);
    setToken(null);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-main-color mb-4">
          Account Deactivated
        </h1>
        <p className="mb-6">
          Sorry, your account has been deactivated. Please contact the
          administrator at{" "}
          <a
            href="mailto:chelceacalin20@stud.ase.ro"
            className="text-details underline"
          >
            chelceacalin20@stud.ase.ro
          </a>{" "}
          for further assistance.
        </p>
        <div className="text-gray-600 mb-4">Return to login</div>
        <button
          onClick={() => logout()} // Assuming 'logout' is a function
          className="bg-blue-detail text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
        >
          Click to go to main page
        </button>
      </div>
    </div>
  );
}

export default Deactivated;
