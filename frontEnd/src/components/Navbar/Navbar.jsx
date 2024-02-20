import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import AppIcon from "../../utils/icons/AppIcon";
function Navbar() {
  let navigate = useNavigate();
  let location=useLocation();

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedColor,setSelectedColor]=useState("");

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
    <div className="flex h-screen w-auto">
      <AppIcon />
    </div>
  );
}

export default Navbar;
