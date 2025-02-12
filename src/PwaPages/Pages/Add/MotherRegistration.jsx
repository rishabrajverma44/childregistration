import React, { use, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MotherRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    dod: "",
    weight: "",
    height: "",
    age: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    dod: Yup.date().required("Birth date is required"),
    weight: Yup.number()
      .required("Weight is required")
      .typeError("Weight must be a number")
      .positive("Weight must be positive")
      .max(150, "Weight must be at most 150"),
    age: Yup.number()
      .typeError("Age must be a number")
      .positive("Age must be positive")
      .required("Age is required")
      .max(150, "Age must be at most 150"),
    height: Yup.number()
      .required("Height is required")
      .typeError("Height must be a number")
      .positive("Height must be positive")
      .max(250, "Height must be at most 250"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://stagedidikadhaba.indevconsultancy.in/testing/mothers/",
        values
      );
      if (res.status === 201) {
        toast.success("Registration successfully done");
        resetForm();
        setTimeout(() => {
          navigate("/Motherlist");
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
      <div className="d-flex justify-content-between">
        <div>
          <b
            style={{ color: "#5E6E82", fontWeight: "bolder", fontSize: "18px" }}
          >
            Mother Registration
          </b>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-2 mb-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-slate-600 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>

                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter mother's name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="dod" className="block text-slate-600 mb-1">
                    Date of Delivery <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    id="dod"
                    name="dod"
                    min="2020-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="dod"
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
                  <label htmlFor="age" className="block text-slate-600 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Enter age"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="age"
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

export default MotherRegistration;
