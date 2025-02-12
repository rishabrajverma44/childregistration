import React from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const Home = () => {
  return (
    <>
      <div className="bg-gray-50 min-h-[90vh]">
        <div className="min-h-80 flex justify-center">
          <div className="flex flex-col sm:flex-row justify-between self-center space-y-4 sm:space-y-0 sm:space-x-4">
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
        </div>
      </div>
    </>
  );
};

export default Home;
