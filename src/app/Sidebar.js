"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative ">
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
          isOpen ? "translate-x-0" : "-translate-x-full "
        } transition-transform duration-300 z-20 w-full md:w-64 md:translate-x-0`}
      >
        <div className="p-4">
          {/* Menu Header - Centered */}
          <h2 className="text-xl font-bold text-center mb-4 border-b border-t border-gray-700 pb-2 pt-2">
            Menu
          </h2>

          {/* Navigation - Two Column Grid */}
          <nav className="text-center">
            <ul className="grid grid-cols-2 gap-4 font-bold">
              <li className="border-b border-gray-700 pb-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>

              <li className="border-b border-gray-700 pb-2">
                <Link href="/basic/allparts" onClick={() => setIsOpen(false)}>
                  All Parts
                </Link>
              </li>
              <li className="border-b border-gray-700 pb-2">
                <Link href="/about" onClick={() => setIsOpen(false)}>
                  About Us
                </Link>
              </li>
              <li className="border-b border-gray-700 pb-2">
                <Link href="/contacts" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
              </li>
              <li className="border-b border-gray-700 pb-2">
                <Link href="/levels/aonelevel" onClick={() => setIsOpen(false)}>
                  A1 Level
                </Link>
              </li>
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
