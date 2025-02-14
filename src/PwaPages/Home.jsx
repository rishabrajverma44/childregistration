import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const Home = () => {
  const [nameList, setNameList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [childData, setChildData] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedName, setSelectedName] = useState(false);
  const getChildren = () => {
    axios
      .get("https://pwa-databackend.indevconsultancy.in/monitoring/schools/")
      .then((res) => {
        setNameList(res.data);
        const data = localStorage.getItem("schoolData");
        const myData = JSON.parse(data);
        if (myData && myData.sch_id) {
          setSearchTerm(myData.school_name);
          setIsDropdownOpen(false);
          setSelectedName(true);
        }
      });
  };
  useEffect(() => {
    getChildren();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelectChild = (child) => {
    setSearchTerm(child.school_name);
    setIsDropdownOpen(false);
    setSelectedName(true);
    localStorage.setItem("schoolData", JSON.stringify(child));
  };

  const handleClearSelection = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    setSelectedName(false);
    localStorage.removeItem("schoolData");
  };

  return (
    <>
      <div className="bg-gray-50 min-h-[90vh]">
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-72">
              <span className="relative flex-1" ref={dropdownRef}>
                <span className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search School Name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={() => setIsDropdownOpen(true)}
                    readOnly={false}
                  />
                  {searchTerm && (
                    <AiOutlineCloseCircle
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500 text-xl cursor-pointer"
                      onClick={handleClearSelection}
                    />
                  )}
                </span>

                {isDropdownOpen && !childData && (
                  <ul className="absolute left-0 right-0 z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
                    {nameList
                      .filter((child) =>
                        child.school_name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((child) => (
                        <li
                          key={child.sch_id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => handleSelectChild(child)}
                        >
                          {child.school_name}
                        </li>
                      ))}
                  </ul>
                )}
              </span>
            </div>
          </div>
          {selectedName && (
            <div className="flex flex-col sm:flex-row justify-center items-center self-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
              <Link to="/Childlist">
                <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-2 px-4 h-12 w-60 rounded">
                  Child Registration
                </button>
              </Link>
              <Link to="/Childmonitorlist">
                <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-2 px-4 h-12 w-60 rounded">
                  Child Monitoring
                </button>
              </Link>
              <Link to="/Motherlist">
                <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-0 px-4 h-12 w-60 rounded">
                  Lactating Mother Registration
                </button>
              </Link>
              <Link to="/Mothermonitorlist">
                <button className="tracking-wide font-semibold bg-btn-primary hover:bg-btn-hoverPrimary text-white py-0 px-4 h-12 w-60 rounded">
                  Lactating Mother Monitoring
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
