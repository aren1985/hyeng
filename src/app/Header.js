"use client";

import React from "react";
import Image from "next/image";
import logo from "./images/logo.jpg";

const Header = () => {
  return (
    <header className="bg-gray-900 text-cyan-300 h-16 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="flex justify-center items-center h-full">
        <Image
          src={logo}
          alt="logo"
          width={70} // Set a fixed width for the logo
          height={70} // Set a fixed height for the logo
          style={{ objectFit: "contain" }} // Ensures the logo maintains its aspect ratio without cropping
        />
      </div>
    </header>
  );
};

export default Header;
