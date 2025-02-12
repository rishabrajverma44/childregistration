import React from "react";

const PublicFooter = () => {
  return (
    <div className="footer">
      <div className="min-h-[20px] flex flex-col">
        <footer className="w-full bg-[#752F21] text-white text-center py-2 fixed bottom-0 left-0">
          <div className="flex justify-between items-center px-3 text-sm">
            <div>
              {" "}
              © 2024{" "}
              <span className="mr-1">
                <a
                  href="https://indevconsultancy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:no-underline hover:text-red-800 transition duration-300"
                >
                  IndevConsultancy
                </a>
              </span>
              . All Rights Reserved.
            </div>
            <div>Privacy Policy | Terms of Use</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PublicFooter;
