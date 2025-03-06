import React from "react";
import Image from "next/image";
import logo from "./images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-cyan-300 py-4 w-full">
      <div className="container mx-auto flex items-center justify-center">
        {/* Logo section with two lines */}
        <div className="flex flex-col items-center mr-4">
          <Image src={logo} alt="Logo" width={100} height={50} />
        </div>

        {/* Text section next to the logo */}
        <div>
          <p>English Learning Website</p>
          <p>Officially Registered Website</p>
        </div>
      </div>
    </footer>
  );
}
