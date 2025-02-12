import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChildMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nameList, setNameList] = useState([]);
  const [name, setName] = useState();
  const navigate = useNavigate();
  const getChildren = () => {
    axios
      .get("https://stagedidikadhaba.indevconsultancy.in/testing/children/")
      .then((res) => {
        setNameList(res.data);
      });
  };
  useEffect(() => {
    getChildren();
  }, []);
  const [childData, setChildData] = useState(null);
  const dropdownRef = useRef(null);

  const handleSelectChild = (child) => {
    setSearchTerm(child.name);
    setIsDropdownOpen(false);
    setName(child.id);
    setChildData(child);
  };

  const handleClearSelection = () => {
    setSearchTerm("");
    setChildData(null);
    setIsDropdownOpen(false);
    setName("");
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

  //form
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    child: name || "",
    weight: "",
    height: "",
    remarks: "",
  };

  const validationSchema = Yup.object({
    child: Yup.number().required("Name is required"),
    weight: Yup.number()
      .required("Weight is required")
      .typeError("Weight must be a number")
      .positive("Weight must be positive")
      .max(150, "Weight must be at most 150"),
    height: Yup.number()
      .required("Height is required")
      .typeError("Height must be a number")
      .positive("Height must be positive")
      .max(250, "Height must be at most 250"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://stagedidikadhaba.indevconsultancy.in/testing/monitoring/`,
        values
      );
      if (res.status === 201) {
        toast.success("Added successfully");
        getChildren();
        setTimeout(() => {
          navigate("/Childmonitorlist");
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
        Child Monitoring Details
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
                        placeholder="Search Child Name"
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
                    <ErrorMessage
                      name="child"
                      component="div"
                      className="text-red-500 text-sm"
                    />

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
                  <label htmlFor="" className="block text-slate-600 mb-1">
                    Monitoring Date
                  </label>
                  <Field
                    type="date"
                    disabled={true}
                    value={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-slate-600 mb-1">
                    Weight (kg) <span className="text-red-500">*</span>
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
                  <label htmlFor="height" className="block text-slate-600 mb-1">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    id="height"
                    name="height"
                    placeholder="Enter height"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="height"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="remarks"
                    className="block text-slate-600 mb-1"
                  >
                    Remarks
                  </label>
                  <Field
                    type="text"
                    id="remarks"
                    name="remarks"
                    placeholder="Enter remarks"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="remarks"
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

export default ChildMonitoring;
