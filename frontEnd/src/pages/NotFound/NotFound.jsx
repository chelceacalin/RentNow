import { useNavigate } from "react-router-dom";

function NotFound() {
  let navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen container bg-main-color ">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-lg">
        <h1 className="text-6xl font-bold text-main-color mb-4">Oops!</h1>
        <p className="text-gray-700 text-lg mb-6">
          The page you are trying to access does not exist.
        </p>
        <button
          className="bg-blue-detail-text-white  text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Go to Main Page
        </button>
      </div>
    </div>
  );
}

export default NotFound;
