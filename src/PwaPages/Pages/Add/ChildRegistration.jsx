import React, { use, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChildRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    // mname: "",
    birth_date: "",
    weight: "",
    height: "",
    gender: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    // mname: Yup.string().required("Mother's Name is required"),
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
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      console.log("values", values);
      const res = await axios.post(
        "https://stagedidikadhaba.indevconsultancy.in/testing/children/",
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
                  <label htmlFor="mname" className="block text-slate-600 mb-1">
                    Mother's Name <span className="text-red-500">*</span>
                  </label>

                  <Field
                    type="text"
                    id="mname"
                    name="mname"
                    placeholder="Enter Mother's Name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="mname"
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
                <div className="md:col-span-2">
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
