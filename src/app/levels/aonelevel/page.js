"use client";

import React from "react";
import Link from "next/link";

const LevPage = () => {
  return (
    <div className="flex flex-col items-center  min-h-screen ">
      <h1 className="text-xl md:text-2xl mt-7 p-2 font-bold text-purple-800 mb-6 shadow-md">
        Select a Category
      </h1>
      <div className=" shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center">
        <ul className="space-y-4 w-full font-bold">
          <li className="w-full">
            <Link
              href="/words/allwords"
              className="block px-4 py-2 text-lg text-white hover:text-blue-800 bg-blue-700 rounded-lg text-center"
            >
              A1 Words
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/themes/allthemes"
              className="block px-4 py-2 text-lg text-white hover:text-blue-800 bg-blue-700 rounded-lg text-center"
            >
              A1 Themes
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/lessons/less"
              className="block px-4 py-2 text-lg text-white hover:text-blue-800 bg-blue-700 rounded-lg text-center"
            >
              Lessons for A1 Level
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LevPage;
