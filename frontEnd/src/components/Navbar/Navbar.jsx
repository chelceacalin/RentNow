import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import AppIcon from "../../utils/icons/AppIcon";
function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const {
    isAdmin,
    setIsAdmin,
    username,
    setUsername,
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
  } = {
    isAdmin: true,
    setIsAdmin: true,
    username: false,
    setUsername: false,
    token: false,
    setToken: false,
    isLoggedIn: true,
    setIsLoggedIn: true,
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedItem("Movies");
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
    <div className="flex h-screen w-auto navbar">
      <div className="flex flex-col h-full p-3 bg-white shadow w-60">
        <div className="flex flex-col h-full space-y-3 justify-between">
          <div className="flex items-center mt-10 ml-3">
            <AppIcon />
          </div>

          <div className="overflow-y-auto">
            <ul className="flex flex-col pt-2 pb-4 space-y-1 text-sm ">
              <li className={`rounded-sm `}>
                <a
                  href="#"
                  className={`flex items-center p-2 space-x-3 rounded-md ${
                    selectedItem === "Movies"
                      ? "aBackgroundClick"
                      : "aBackgroundRelease"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("Movies", "red");
                    navigate("/");
                  }}
                >
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25 12.5C25 5.59642 19.4036 0 12.5 0C5.59642 0 0 5.59642 0 12.5C0 19.4036 5.59642 25 12.5 25H25V22.9167H19.401C22.8958 20.6029 24.9985 16.6916 25 12.5ZM18.6228 20.9274C17.2267 21.9416 15.272 21.6324 14.2578 20.2357C13.2436 18.8395 13.5529 16.8854 14.949 15.8707C16.3457 14.8565 18.2999 15.1657 19.3141 16.5624C20.3288 17.9586 20.019 19.9127 18.6228 20.9274ZM18.4692 7.27488C20.1106 6.74133 21.8735 7.63957 22.407 9.2809C22.9401 10.9227 22.0418 12.6856 20.4005 13.2187C18.7592 13.7522 16.9963 12.854 16.4627 11.2127C15.9297 9.57133 16.8279 7.80792 18.4692 7.27488ZM12.5 2.08333C14.2258 2.08333 15.625 3.48256 15.625 5.20833C15.625 6.9341 14.2258 8.33333 12.5 8.33333C10.7742 8.33333 9.375 6.9341 9.375 5.20833C9.375 3.48256 10.7742 2.08333 12.5 2.08333ZM2.59298 9.2809C3.12653 7.63957 4.88942 6.74133 6.53076 7.27437C8.1721 7.80792 9.07033 9.57082 8.53729 11.2122C8.00374 12.8535 6.24084 13.7517 4.59951 13.2187C2.95817 12.6856 2.05994 10.9227 2.59298 9.2809ZM10.7422 20.2357C9.72799 21.6324 7.77334 21.9416 6.37716 20.9274C4.98098 19.9127 4.67122 17.9586 5.68593 16.5624C6.70013 15.1662 8.65479 14.8565 10.051 15.8712C11.4471 16.8854 11.7564 18.8395 10.7422 20.2357ZM11.4583 12.5C11.4583 11.9247 11.9247 11.4583 12.5 11.4583C13.0753 11.4583 13.5417 11.9247 13.5417 12.5C13.5417 13.0753 13.0753 13.5417 12.5 13.5417C11.9247 13.5417 11.4583 13.0753 11.4583 12.5Z"
                      fill={selectedItem === "Movies" ? "#1C1C59" : "#1E1D5B"}
                    />
                  </svg>
                  <span
                    style={{ fontSize: 16 }}
                    className={`${
                      selectedItem === "Movies" ? "spanClick" : "spanRelease"
                    }`}
                  >
                    {" "}
                    Movies
                  </span>
                </a>
              </li>
              <li className="rounded-sm">
                <a
                  href="#"
                  className={`flex items-center p-2 space-x-3 rounded-md ${
                    selectedItem === "profile"
                      ? "aBackgroundClick"
                      : "aBackgroundRelease"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("profile", "red");
                    navigate(`/myprofile/${username}`);
                  }}
                >
                  <svg
                    width="25"
                    height="27"
                    viewBox="0 0 25 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.55775 13.7862C9.66352 14.5939 11.0289 15.0651 12.5001 15.0651C16.0981 15.0651 19.2308 11.9506 19.2308 8.33428C19.2308 4.62275 16.2116 1.60352 12.5001 1.60352C8.78852 1.60352 5.76929 4.62275 5.76929 8.33428C5.76929 10.5747 6.86544 12.5651 8.55775 13.7862Z"
                      fill={selectedItem === "profile" ? "#1C1C59" : "#1E1D5B"}
                    />
                    <path
                      d="M18.4231 14.6323C16.875 16.0939 14.7885 16.9881 12.5 16.9881C10.2115 16.9881 8.125 16.0939 6.57692 14.6323C2.66346 16.7477 0 20.8919 0 25.6419C0 26.1708 0.432692 26.6035 0.961538 26.6035H24.0385C24.5673 26.6035 25 26.1708 25 25.6419C25 20.8919 22.3365 16.7477 18.4231 14.6323Z"
                      fill={selectedItem === "profile" ? "#1C1C59" : "#1E1D5B"}
                    />
                  </svg>

                  <span
                    style={{ fontSize: 16 }}
                    className={`${
                      selectedItem === "profile" ? "spanClick" : "spanRelease"
                    }`}
                  >
                    {" "}
                    Profile
                  </span>
                </a>
              </li>
              <li className="rounded-sm">
                {isAdmin && (
                  <a
                    href="#"
                    className={`flex items-center p-2 space-x-3 rounded-md ${
                      selectedItem === "roleManagement"
                        ? "aBackgroundClick"
                        : "aBackgroundRelease"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick("roleManagement", "red");
                      navigate("/roleManagement");
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.2322 0C11.6165 0 10.2538 1.3627 10.2538 2.97842C10.2538 4.59413 11.6165 5.95683 13.2322 5.95683C14.8479 5.95683 16.1618 4.59413 16.1618 2.97842C16.1618 1.3627 14.8479 0 13.2322 0Z"
                        fill={
                          selectedItem === "roleManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                      <path
                        d="M16.4832 5.9585C15.6783 6.851 14.5255 7.42329 13.2318 7.42329C11.9381 7.42329 10.7364 6.851 9.9315 5.9585C9.22879 6.73772 8.78857 7.75853 8.78857 8.88809V9.62048C8.78857 10.0253 9.11615 10.3529 9.52097 10.3529H16.8938C17.2986 10.3529 17.6262 10.0253 17.6262 9.62048V8.88809C17.6262 7.75853 17.1859 6.73772 16.4832 5.9585Z"
                        fill={
                          selectedItem === "roleManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                      <path
                        d="M7.07601 22.4808L3.34367 14.9979C2.98328 14.2753 2.10616 13.9806 1.3827 14.3391L0.407193 14.8223C0.0439725 15.0024 -0.103825 15.4439 0.0774674 15.8065L4.47185 24.5952C4.65256 24.9577 5.09214 25.1019 5.45243 24.9242L6.41539 24.4471C7.14168 24.0874 7.43772 23.2061 7.07601 22.4808Z"
                        fill={
                          selectedItem === "roleManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                      <path
                        d="M24.3988 12.0933C23.7982 11.6539 22.9633 11.7418 22.4653 12.2837L18.4615 17.2054C18.1832 17.4984 17.6559 17.6742 17.3776 17.6742H13.9645C13.5544 17.6742 13.2321 17.352 13.2321 16.9418C13.2321 16.5316 13.5544 16.2094 13.9645 16.2094C14.9455 16.2094 16.0315 16.2094 16.8941 16.2094C17.6998 16.2094 18.3589 15.5502 18.3589 14.7446C18.3589 13.939 17.6998 13.2798 16.8941 13.2798C13.4545 13.2798 16.7354 13.2798 13.0564 13.2798C12.6913 13.2798 12.5093 13.0483 12.2214 12.7964C11.0882 11.7766 9.39199 11.2853 7.67477 11.6834C6.72128 11.9044 6.07829 12.2895 5.42616 12.806L5.40443 12.7884L4.34509 13.7207L8.50823 22.0686H9.74101H16.8941C18.271 22.0686 19.5894 21.4094 20.4097 20.3108L24.7064 14.1587C25.1898 13.5141 25.0579 12.5767 24.3988 12.0933Z"
                        fill={
                          selectedItem === "roleManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                    </svg>

                    <span
                      style={{ fontSize: 16 }}
                      className={`${
                        selectedItem === "roleManagement"
                          ? "spanClick"
                          : "spanRelease"
                      }`}
                    >
                      {" "}
                      Role Management
                    </span>
                  </a>
                )}
              </li>
              <li className="rounded-sm">
                {isAdmin && (
                  <a
                    href="#"
                    className={`flex items-center p-2 space-x-3 rounded-md ${
                      selectedItem === "categoryManagement"
                        ? "aBackgroundClick"
                        : "aBackgroundRelease"
                    }`}
                    onClick={(e) => {
                      {
                        e.preventDefault();
                        handleItemClick("categoryManagement", "red");
                        navigate("/categoryManagement");
                      }
                    }}
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.07601 22.4798L3.34367 14.9969C2.98328 14.2743 2.10616 13.9797 1.3827 14.3381L0.407193 14.8213C0.0439725 15.0015 -0.103825 15.4429 0.0774674 15.8055L4.47185 24.5943C4.65256 24.9567 5.09214 25.1009 5.45243 24.9232L6.41539 24.4462C7.14168 24.0864 7.43772 23.2051 7.07601 22.4798Z"
                        fill={
                          selectedItem === "categoryManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                      <path
                        d="M24.3987 12.0928C23.7981 11.6534 22.9631 11.7413 22.4652 12.2833L18.4614 17.205C18.1831 17.4979 17.6558 17.6737 17.3774 17.6737H13.9644C13.5542 17.6737 13.232 17.3515 13.232 16.9413C13.232 16.5311 13.5542 16.2089 13.9644 16.2089C14.9453 16.2089 16.0313 16.2089 16.894 16.2089C17.6996 16.2089 18.3588 15.5497 18.3588 14.7441C18.3588 13.9385 17.6996 13.2793 16.894 13.2793C13.4544 13.2793 16.7353 13.2793 13.0563 13.2793C12.6912 13.2793 12.5092 13.0478 12.2213 12.7959C11.0881 11.7761 9.39187 11.2848 7.67464 11.6829C6.72116 11.9039 6.07816 12.2891 5.42604 12.8055L5.40431 12.7879L4.34497 13.7202L8.50811 22.0681H9.74088H16.894C18.2709 22.0681 19.5893 21.4089 20.4096 20.3103L24.7062 14.1582C25.1896 13.5136 25.0578 12.5763 24.3987 12.0928Z"
                        fill={
                          selectedItem === "categoryManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                      <path
                        d="M12.4 0.8V3.6C12.4 3.81217 12.3157 4.01566 12.1657 4.16569C12.0157 4.31571 11.8122 4.4 11.6 4.4H8.8C8.58783 4.4 8.38434 4.31571 8.23431 4.16569C8.08429 4.01566 8 3.81217 8 3.6V0.8C8 0.587827 8.08429 0.384344 8.23431 0.234315C8.38434 0.0842854 8.58783 0 8.8 0H11.6C11.8122 0 12.0157 0.0842854 12.1657 0.234315C12.3157 0.384344 12.4 0.587827 12.4 0.8ZM17.2 0H14.4C14.1878 0 13.9843 0.0842854 13.8343 0.234315C13.6843 0.384344 13.6 0.587827 13.6 0.8V3.6C13.6 3.81217 13.6843 4.01566 13.8343 4.16569C13.9843 4.31571 14.1878 4.4 14.4 4.4H17.2C17.4122 4.4 17.6157 4.31571 17.7657 4.16569C17.9157 4.01566 18 3.81217 18 3.6V0.8C18 0.587827 17.9157 0.384344 17.7657 0.234315C17.6157 0.0842854 17.4122 0 17.2 0ZM11.6 5.6H8.8C8.58783 5.6 8.38434 5.68429 8.23431 5.83431C8.08429 5.98434 8 6.18783 8 6.4V9.2C8 9.41217 8.08429 9.61566 8.23431 9.76569C8.38434 9.91571 8.58783 10 8.8 10H11.6C11.8122 10 12.0157 9.91571 12.1657 9.76569C12.3157 9.61566 12.4 9.41217 12.4 9.2V6.4C12.4 6.18783 12.3157 5.98434 12.1657 5.83431C12.0157 5.68429 11.8122 5.6 11.6 5.6ZM15.8 5.6C15.3649 5.6 14.9395 5.72903 14.5777 5.97077C14.216 6.21251 13.934 6.5561 13.7675 6.9581C13.601 7.36009 13.5574 7.80244 13.6423 8.2292C13.7272 8.65596 13.9367 9.04796 14.2444 9.35563C14.552 9.66331 14.944 9.87284 15.3708 9.95773C15.7976 10.0426 16.2399 9.99905 16.6419 9.83253C17.0439 9.66602 17.3875 9.38404 17.6292 9.02225C17.871 8.66047 18 8.23512 18 7.8C18 7.21652 17.7682 6.65694 17.3556 6.24436C16.9431 5.83178 16.3835 5.6 15.8 5.6Z"
                        fill={
                          selectedItem === "categoryManagement"
                            ? "#1C1C59"
                            : "#1E1D5B"
                        }
                      />
                    </svg>

                    <span
                      style={{ fontSize: 16 }}
                      className={`${
                        selectedItem === "categoryManagement"
                          ? "spanClick"
                          : "spanRelease"
                      }`}
                    >
                      {" "}
                      Category Management
                    </span>
                  </a>
                )}
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <li className="rounded-sm">
                <a
                  href="#"
                  className={`flex items-center p-2 space-x-3 rounded-md ${
                    selectedItem === "logout"
                      ? "aBackgroundClick"
                      : "aBackgroundRelease"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("logout", "red");
                    setIsAdmin(false);
                    setIsLoggedIn(false);
                    setUsername(null);
                    setToken(null);
                    window.location.href=url+"/logout";
                  }}
                >
                  <svg
                    width="25"
                    height="26"
                    viewBox="0 0 25 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.9197 11.6696C24.8666 11.5425 24.7906 11.4269 24.6937 11.33L21.5697 8.20605C21.1625 7.7998 20.5041 7.7998 20.0968 8.20605C19.6896 8.61333 19.6896 9.27271 20.0968 9.67896L21.4437 11.0258H15.6249C15.0489 11.0258 14.5833 11.4925 14.5833 12.0675C14.5833 12.6425 15.0489 13.1091 15.6249 13.1091H21.4437L20.0968 14.456C19.6895 14.8633 19.6895 15.5227 20.0968 15.9289C20.2999 16.1331 20.5666 16.2341 20.8333 16.2341C21.1 16.2341 21.3666 16.1331 21.5697 15.9289L24.6937 12.8049C24.7906 12.7091 24.8666 12.5935 24.9197 12.4653C25.0249 12.2113 25.0249 11.9238 24.9197 11.6696Z"
                      fill={selectedItem === "logout" ? "#1C1C59" : "#1E1D5B"}
                    />
                    <path
                      d="M17.7083 15.1927C17.1323 15.1927 16.6666 15.6594 16.6666 16.2344V21.4427H12.5V4.77603C12.5 4.31665 12.1979 3.9104 11.7573 3.77813L8.13955 2.69272H16.6666V7.90107C16.6666 8.47607 17.1323 8.94273 17.7083 8.94273C18.2843 8.94273 18.75 8.47607 18.75 7.90107V1.65107C18.75 1.07603 18.2843 0.609375 17.7083 0.609375H1.04165C1.00415 0.609375 0.970801 0.625 0.934375 0.62915C0.8854 0.634375 0.840625 0.642676 0.79375 0.65415C0.684375 0.682275 0.5854 0.725 0.492725 0.783301C0.469824 0.7979 0.441699 0.798926 0.419824 0.815576C0.411426 0.821875 0.408301 0.83335 0.399951 0.8396C0.286426 0.92915 0.19165 1.03853 0.1229 1.16875C0.108301 1.19688 0.105176 1.2271 0.09375 1.25625C0.0604004 1.3354 0.0239746 1.4125 0.0114746 1.5C0.00625 1.53125 0.015625 1.5604 0.0145996 1.59063C0.0135742 1.61147 0 1.63022 0 1.65103V22.4844C0 22.9813 0.351025 23.4083 0.8375 23.5052L11.2541 25.5886C11.3219 25.6032 11.3906 25.6094 11.4583 25.6094C11.6968 25.6094 11.9312 25.5271 12.1187 25.3729C12.3593 25.175 12.5 24.8802 12.5 24.5677V23.5261H17.7083C18.2843 23.5261 18.75 23.0594 18.75 22.4844V16.2344C18.75 15.6594 18.2843 15.1927 17.7083 15.1927Z"
                      fill={selectedItem === "logout" ? "#1C1C59" : "#1E1D5B"}
                    />
                  </svg>

                  <span
                    style={{ fontSize: 16 }}
                    className={`${
                      selectedItem === "logout" ? "spanClick" : "spanRelease"
                    }`}
                  >
                    {" "}
                    Log Out
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
