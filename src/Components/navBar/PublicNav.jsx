import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";

const PublicNav = () => {
  const [isSideMenuOpen, setMenu] = useState(false);

  return (
    <>
      <main className="sticky top-0 z-50 bg-white border-b-4 border-[#A24C4A] shadow-sm">
        <nav className="flex justify-between items-center px-2 py-1 border-0 relative z-50">
          <section className="flex justify-between items-center w-full">
            <div className="flex items-center justify-center">
              <Link to="/">
                <img src="/images/logo.png" alt="logo" />
              </Link>
            </div>

            <FiMenu
              onClick={() => setMenu(true)}
              className="text-3xl cursor-pointer mt-3 md:hidden"
            />
          </section>

          <div
            className={clsx(
              "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 left-0 z-40 transition-all transform",
              isSideMenuOpen ? "translate-y-0" : "translate-x-full"
            )}
          >
            <section className="text-black bg-white flex-col absolute right-0 top-0 h-screen py-8 gap-8 z-50 w-70">
              <IoCloseOutline
                onClick={() => setMenu(false)}
                className="mt-0 mx-3 mb-12 text-2xl cursor-pointer text-4xl"
              />
              <div className="mx-1">
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/"
                  onClick={() => setMenu(false)}
                >
                  Home
                </Link>
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/Childlist"
                  onClick={() => setMenu(false)}
                >
                  Child List
                </Link>
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/Childmonitorlist"
                  onClick={() => setMenu(false)}
                >
                  Child Monitoring
                </Link>

                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/Motherlist"
                  onClick={() => setMenu(false)}
                >
                  Mother List
                </Link>
                <Link
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-bold no-underline text-xl"
                  to="/Mothermonitorlist"
                  onClick={() => setMenu(false)}
                >
                  Mother Monitoring
                </Link>
              </div>
            </section>
          </div>
        </nav>
      </main>
    </>
  );
};

export default PublicNav;
