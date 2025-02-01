"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token or user authentication status here (e.g., from localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear token and set logged out state
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-gray-900 text-cyan-300 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Project Name on the Left */}
        <h1 className="text-xl font-bold ml-14">HiEng</h1>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="flex space-x-4 justify-end">
            {/* Conditional Login, Sign Up, or Logout */}
            {!isLoggedIn ? (
              <div className="flex space-x-4">
                <li className="text-sm md:text-lg">
                  <Link href="/auth/login">Login</Link>
                </li>
                <li className="text-sm md:text-lg">
                  <Link href="/auth/signup">Sign Up</Link>
                </li>
              </div>
            ) : (
              <li
                className="text-sm md:text-lg cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
