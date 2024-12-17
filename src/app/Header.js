import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-900 text-cyan-300 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Project Name on the Left */}
        <h1 className="text-xl font-bold ml-14">Your Project</h1>

        {/* Navigation (Flex to push the toggle button to the right) */}
        <nav className="flex-grow">
          <ul className="flex space-x-4 justify-end">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
