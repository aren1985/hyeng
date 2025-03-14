"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "./AuthContext"; // ✅ Keep only AuthContext

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext); // ✅ Now it works globally!

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-3 left-4 z-30 bg-gray-900 text-cyan-300 p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-[60px] left-0 h-[calc(100%-64px)] bg-gray-900 text-cyan-300 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20 w-full md:w-64 md:translate-x-0`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-center mb-4 border-b border-t border-gray-700 pb-2 pt-2">
            Menu
          </h2>

          <nav className="text-center">
            <ul className="grid grid-cols-2 gap-4 font-bold">
              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/basic/allparts" onClick={() => setIsOpen(false)}>
                  Images
                </Link>
              </li>
              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/levels/aonelevel" onClick={() => setIsOpen(false)}>
                  A1 Level
                </Link>
              </li>
              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/about" onClick={() => setIsOpen(false)}>
                  About Us
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/levels/atwolevel" onClick={() => setIsOpen(false)}>
                  A2 Level
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/contacts" onClick={() => setIsOpen(false)}>
                  contact
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/levels/bonelevel" onClick={() => setIsOpen(false)}>
                  B1 Level
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/info" onClick={() => setIsOpen(false)}>
                  Info
                </Link>
              </li>
              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/levels/btwolevel" onClick={() => setIsOpen(false)}>
                  B2 Level
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                <Link href="/freeless/free" onClick={() => setIsOpen(false)}>
                  free
                </Link>
              </li>

              {/* Conditional Rendering for Login/Signup or Logout */}
              {isLoggedIn ? (
                <>
                  <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      Profile
                    </Link>
                  </li>

                  <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                    <button onClick={logout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      Signup
                    </Link>
                  </li>
                  <li className="border-b border-gray-700 pb-2 hover:text-purple-500">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-10 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;
