import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/navBar/Navbar";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PrivateRoute;
