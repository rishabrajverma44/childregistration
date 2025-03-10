import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import Webcam from "react-webcam";

const MotherMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nameList, setNameList] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const webcamRef1 = useRef(null);
  const navigate = useNavigate();
  const [schoolData, setSchoolList] = useState(null);
  const [monetringList, setMonetoringList] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem("schoolData");
    if (data) {
      const json = JSON.parse(data);
      setSchoolList(json);
    }
  }, []);
  const getChildren = (id) => {
    axios
      .get(
        `https://pwa-databackend.indevconsultancy.in/monitoring/mothers/?school=${id}`
      )
      .then((res) => {
        setNameList(res.data);
      });
  };
  useEffect(() => {
    if (schoolData) {
      getChildren(schoolData.sch_id);
    }
  }, [schoolData]);
  const [childData, setChildData] = useState(null);
  const dropdownRef = useRef(null);
  const childDetails = (child) => {
    axios
      .get(
        `https://pwa-databackend.indevconsultancy.in/monitoring/mothers/${child.mom_id}/`
      )
      .then((res) => {
        setChildData(res.data);
      });
  };
  const handleSelectChild = (child) => {
    setSearchTerm(child.name);
    setIsDropdownOpen(false);
    childDetails(child);
    setChildData(child);
  };
  const handleClearSelection = () => {
    setSearchTerm("");
    setChildData(null);
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    mother: childData?.mom_id || "",
    health_status: "",
    notes: "",
    weight: "",
    school: schoolData?.sch_id ?? null,
    image: imageSrc,
  };
  const handleToggleCamera = () => {
    setIsCameraOpen((prev) => {
      const newCameraState = !prev;
      if (!newCameraState) {
        resetCaptureState();
      }
      return newCameraState;
    });
  };
  const handleCapture = () => {
    if (webcamRef1.current) {
      const capturedImage = webcamRef1.current.getScreenshot();
      if (capturedImage) {
        setImageSrc(capturedImage);
        setIsCaptured(true);
        setIsCameraOpen(false);
      } else {
        setImageSrc(null);
      }
    }
  };
  const handleRetake = () => {
    setIsCaptured(false);
    setImageSrc(null);
    setIsCameraOpen(true);
  };
  const handleSwitchCamera = () => {
    setIsBackCamera((prev) => !prev);
  };
  const resetCaptureState = () => {
    setIsCaptured(false);
    setImageSrc(null);
  };
  const validationSchema = Yup.object({
    weight: Yup.number()
      .typeError("Weight must be a number")
      .positive("Weight must be positive")
      .required("Weight is required")
      .max(150, "Weight must be at most 150"),
  });
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://pwa-databackend.indevconsultancy.in/monitoring/monitoring_mother/`,
        values
      );
      if (res.status === 201) {
        toast.success("Added successfully");
        setTimeout(() => {
          navigate("/Mothermonitorlist");
        }, 1000);
      }
    } catch (error) {
      console.error("Error in sending data:", error);
      toast.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 bg-slate-100 py-6 min-h-screen">
      <ToastContainer />

      <h2 className="text-xl font-semibold text-slate-700 mb-2">
        Mother Monitoring Details
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="flex items-center text-slate-600 mb-1"
                  >
                    <span className="mr-1">Name</span>
                    <span className="text-red-500">*</span>
                  </label>

                  <span className="relative flex-1" ref={dropdownRef}>
                    <span className="relative">
                      <input
                        type="text"
                        placeholder="Search Mother's Name"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={() => setIsDropdownOpen(true)}
                        readOnly={!!childData}
                      />
                      {childData && (
                        <AiOutlineCloseCircle
                          className="absolute top-0 right-2 text-red-500 text-xl cursor-pointer"
                          onClick={handleClearSelection}
                        />
                      )}
                    </span>

                    {isDropdownOpen && !childData && (
                      <ul className="absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 max-h-40 w-full overflow-y-auto">
                        {nameList
                          .filter((child) =>
                            child.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((child) => (
                            <li
                              key={child.id}
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => handleSelectChild(child)}
                            >
                              {child.name}
                            </li>
                          ))}
                      </ul>
                    )}
                  </span>
                </div>

                <div>
                  <label htmlFor="weight" className="block text-slate-600 mb-1">
                    Weight ( kg) <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    id="weight"
                    name="weight"
                    placeholder="Enter weight"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="weight"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="health_status"
                    className="block text-slate-600 mb-1"
                  >
                    Health Status
                  </label>
                  <Field
                    type="type"
                    id="health_status"
                    name="health_status"
                    placeholder="Enter health status"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="health_status"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-slate-600 mb-1">
                    Notes
                  </label>
                  <Field
                    type="type"
                    id="notes"
                    name="notes"
                    placeholder="Enter notes"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className={`p-2 rounded-lg ${
                    isLoading ? "bg-gray-300" : "bg-[#A24C4A] text-white"
                  } ml-auto`}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MotherMonitoring;
