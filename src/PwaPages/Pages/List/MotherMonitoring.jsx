import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const MotherMonitoring = () => {
  const [childrenData, setChildList] = useState([]);
  const [schoolData, setSchoolList] = useState(null);

  useEffect(() => {
    if (schoolData?.sch_id !== undefined) {
      axios
        .get(
          `https://pwa-databackend.indevconsultancy.in/monitoring/monitoring_mother/?school=${schoolData.sch_id}`
        )
        .then((response) => {
          setChildList(response.data.reverse());
        });
    }
  }, [schoolData]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  useEffect(() => {
    const data = localStorage.getItem("schoolData");
    if (data) {
      const json = JSON.parse(data);
      setSchoolList(json);
    }
  }, []);

  const filteredChildren = childrenData.filter((child) =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedChildren = filteredChildren.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="px-6 md:px-12 bg-slate-100 py-6 min-h-screen">
      <div className="flex flex-row items-center md:justify-between gap-2">
        <input
          type="text"
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="w-full md:w-64 p-2 py-1 border border-gray-300 rounded-md focus:outline-none"
        />
        <Link
          to="/mothermonitoring"
          className="d-flex align-items-center btn btn-dark hover:bg-[#53230A] px-3 py-1"
        >
          <FaPlus className="me-1 text-sm" />
          <span>Monitoring</span>
        </Link>
      </div>
      <div className="mt-2">
        {displayedChildren.map((child) => (
          <div
            key={child.id}
            className="bg-white shadow-md rounded-lg px-2 py-2 mt-2"
          >
            <h3 className="text-lg font-semibold">{child.name}</h3>
            <p className="text-gray-600 py-0 my-0">
              Weight: {child.weight} (in kg)
            </p>
            <p className="text-gray-600 py-0 my-0">
              Health Status: {child.health_status}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-4 mb-4 space-x-2 md:space-x-4 text-sm">
          <button
            className={`px-2 md:px-6 py-2 rounded-lg font-medium transition ${
              currentPage === 1
                ? "bg-[#A24C4A] text-white hover:bg-[#832E2C] cursor-not-allowed"
                : "bg-[#A24C4A] text-white hover:bg-[#832E2C]"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="px-2 md:px-4 py-2 text-sm md:text-base font-semibold bg-gray-100 rounded-lg shadow-sm border-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === totalPages
                ? "bg-[#A24C4A] text-white hover:bg-[#832E2C] cursor-not-allowed"
                : "bg-[#A24C4A] text-white hover:bg-[#832E2C]"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MotherMonitoring;
