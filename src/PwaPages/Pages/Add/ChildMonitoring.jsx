import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import Webcam from "react-webcam";
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const defaultCenter = { lat: 28.536482, lng: 77.270955 };

const ChildMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nameList, setNameList] = useState([]);
  const [name, setName] = useState();
  const navigate = useNavigate();
  const [schoolData, setSchoolList] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState("");
  const [monetringList, setMonetoringList] = useState([]);

  const getChildren = (id) => {
    axios
      .get(
        `https://pwa-databackend.indevconsultancy.in/monitoring/children/?school=${id}`
      )
      .then((res) => {
        setNameList(res.data);
      });
  };
  useEffect(() => {
    if (schoolData?.sch_id !== undefined) {
      getChildren(schoolData.sch_id);
    }
  }, [schoolData]);
  const [childData, setChildData] = useState(null);
  const dropdownRef = useRef(null);
  const handleClearSelection = () => {
    setSearchTerm("");
    setChildData(null);
    setIsDropdownOpen(false);
    setName("");
  };
  useEffect(() => {
    const data = localStorage.getItem("schoolData");
    if (data) {
      const json = JSON.parse(data);
      setSchoolList(json);
    }
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

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const webcamRef1 = useRef(null);
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
  const handleSelectChild = (child) => {
    setSearchTerm(child.name);
    setIsDropdownOpen(false);
    setName(child.id);
    setChildData(child);
  };
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    child: name || "",
    weight: "",
    height: "",
    remarks: "",
    longitude: location.longitude || "",
    latitude: location.latitude || "",
    location: address || "",
    school: schoolData?.sch_id ?? null,
    image: imageSrc,
  };
  const reverseGeocode = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    );
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const formattedAddress = results[0].formatted_address;
        location.value = formattedAddress;
        setAddress(formattedAddress);
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://pwa-databackend.indevconsultancy.in/monitoring/monitoring/`,
        values
      );
      if (res.status === 201) {
        toast.success("Added successfully");
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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
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
  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          reverseGeocode(newLocation);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser.");
    }
  }, [isLoaded]);
  if (loadError) {
    return <div>Error loading maps</div>;
  }
  const mapCenter =
    location.latitude && location.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : defaultCenter;

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }
  return (
    <div className="px-6 md:px-12 bg-slate-100 py-6 min-h-screen">
      <ToastContainer />

      <h2 className="text-xl font-semibold text-slate-700 mb-2">
        Child Monitoring Details
      </h2>
      {/* <div className="bg-white shadow-md rounded-lg p-6 mb-2"></div> */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="row inline-block p-2">
                {isCameraOpen && !isCaptured && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef1}
                      screenshotFormat="image/jpeg"
                      className="w-full h-96 object-cover rounded-md"
                      videoConstraints={{
                        facingMode: isBackCamera ? "environment" : "user",
                      }}
                    />
                    <div className="bottom-4 mt-2 w-full flex justify-center space-x-6">
                      <button
                        onClick={handleCapture}
                        className="py-1 px-1 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FaCamera size={30} />
                      </button>
                      <button
                        onClick={handleToggleCamera}
                        className="py-1 px-1 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FiX size={30} />
                      </button>
                      <button
                        onClick={handleSwitchCamera}
                        className="py-1 px-1 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FiRefreshCcw size={30} />
                      </button>
                    </div>
                  </>
                )}
                {!isCameraOpen && !isCaptured && (
                  <div className="h-96 bg-gray-300 flex flex-col items-center justify-between rounded-md">
                    <div className="flex-grow flex items-center flex-col justify-center">
                      <h2 className="text-gray-500 mb-4">Capture Image</h2>
                      <p className="text-gray-500">Camera is off</p>
                      <button
                        onClick={handleToggleCamera}
                        className="py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        <FaCamera size={30} />
                      </button>
                    </div>
                  </div>
                )}

                {isCaptured && imageSrc && (
                  <div className="mt-6">
                    <img
                      src={imageSrc}
                      alt="Captured"
                      className="w-full h-96 object-cover rounded-md"
                    />
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleRetake}
                        className="py-2 px-4 rounded-lg shadow-md text-white bg-[#0B1727] hover:bg-[#53230A]"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                <div className="">
                  <label
                    htmlFor="address"
                    className="block text-slate-600 mb-1 font-medium"
                  >
                    Address
                  </label>
                  <Field
                    as="textarea"
                    id="location"
                    name="location"
                    disabled={true}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="my-4">
                  <GoogleMap
                    center={mapCenter}
                    zoom={16}
                    mapContainerStyle={mapContainerStyle}
                  >
                    {location.latitude && location.longitude && (
                      <MarkerF
                        position={{
                          lat: location.latitude,
                          lng: location.longitude,
                        }}
                      />
                    )}
                  </GoogleMap>
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
