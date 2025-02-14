import React, { use, useEffect, useRef, useState } from "react";
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

const ChildRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef1 = useRef(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const navigate = useNavigate();
  const [schoolData, setSchoolList] = useState(null);

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

  const state = [
    { state_id: 1, state_name: "Bihar" },
    { state_id: 2, state_name: "Delhi" },
    { state_id: 3, state_name: "Haryana" },
    { state_id: 3, state_name: "Chhattisgarh" },
    { state_id: 4, state_name: "Assam" },
    { state_id: 5, state_name: "West Bengal" },
    { state_id: 6, state_name: "Uttar Pradesh" },
    { state_id: 7, state_name: "Odisha" },
    { state_id: 8, state_name: "Rajasthan" },
    { state_id: 9, state_name: "Punjab" },
  ];

  const handleToggleCamera = () => {
    setIsCameraOpen((prev) => {
      const newCameraState = !prev;
      if (!newCameraState) {
        resetCaptureState();
      }
      return newCameraState;
    });
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

  const initialValues = {
    name: "",
    mother_name: "",
    birth_date: "",
    weight: "",
    height: "",
    gender: "",
    longitude: location.longitude || "",
    latitude: location.latitude || "",
    location: address || "",
    state: "",
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

  useEffect(() => {
    const data = localStorage.getItem("schoolData");
    if (data) {
      const json = JSON.parse(data);
      setSchoolList(json);
    }
  }, []);
  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://pwa-databackend.indevconsultancy.in/monitoring/children/",
        values
      );
      if (res.status === 201) {
        toast.success("Registration successfully done");
        resetForm();
        setTimeout(() => {
          navigate("/ChildList");
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
    name: Yup.string().required("Name is required"),
    mother_name: Yup.string().required("Mother's Name is required"),
    birth_date: Yup.date().required("Birth date is required"),
    weight: Yup.number()
      .required("Weight is required")
      .typeError("Weight must be a number")
      .positive("Weight must be positive")
      .max(50, "Weight must be at most 50"),
    height: Yup.number()
      .required("Height is required")
      .typeError("Height must be a number")
      .positive("Height must be positive")
      .max(250, "Height must be at most 250"),
    state: Yup.string().required("State is required"),
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
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Child Registration
          </b>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-2 mb-4">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="row inline-block p-2 w-full">
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
                  <label htmlFor="name" className="block text-slate-600 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter child's name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mother_name"
                    className="block text-slate-600 mb-1"
                  >
                    Mother's Name <span className="text-red-500">*</span>
                  </label>

                  <Field
                    type="text"
                    id="mother_name"
                    name="mother_name"
                    placeholder="Enter Mother's Name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="mother_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="birth_date"
                    className="block text-slate-600 mb-1"
                  >
                    Birth Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    id="birth_date"
                    name="birth_date"
                    min="2010-12-31"
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="birth_date"
                    component="div"
                    className="text-red-500 text-sm"
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
                  <label className="block text-slate-600 mb-1">Sex</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="gender"
                        value="Male"
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="gender"
                        value="Female"
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                  <ErrorMessage
                    name="gender"
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

                <div>
                  <label htmlFor="state" className="block text-slate-600 mb-1">
                    Home State
                  </label>
                  <Field
                    as="select"
                    id="state"
                    name="state"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => {
                      const selectedValue = Number(e.target.value);
                      setFieldValue("state", selectedValue);
                    }}
                  >
                    <option value="" disabled selected>
                      Select a state
                    </option>
                    {state.map((item) => (
                      <option key={item.state_id} value={item.state_id}>
                        {item.state_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="state"
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

export default ChildRegistration;
