import { useNavigate } from "react-router-dom";
import "./css/NotFound.scss";
import { useEffect } from "react";
import "../../variables.scss";

function NotFound() {
  
    let navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "#7eaaed";

    return () => {
      document.body.style.background = "white";
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen container notfound ">
      <div className="error-page">
        <h1 className="ffont font-bold text-l text-white">Oops!</h1>
        <p className=" text-white  ffont">
          The page you are trying to access does not exist
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mt-4  rounded-full btn ffont-btn"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Go to main page
        </button>
      </div>
    </div>
  );
}

export default NotFound;
