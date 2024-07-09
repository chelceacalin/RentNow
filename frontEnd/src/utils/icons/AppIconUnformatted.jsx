import "../../variables.scss";

export default function AppIconUnformatted() {
  return (
    <div style={{ position: 'absolute', zIndex: 1000 }} className="AppIconUnformatted">
      <svg
        className="w-20 h-20  text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
        />
      </svg>
      <span className="font-bold mt-6 main-text-color text-2xl  ">
        Rent Now
      </span>
    </div>
  );
}

