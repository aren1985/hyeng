"use client";

import React from "react";
import Link from "next/link";

const LevPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-2xl mt-7 py-1 px-6 rounded-lg bg-white font-bold text-purple-800 mb-6 shadow-md">
        Select a Category
      </h1>
      <div className=" shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center">
        <ul className="space-y-4 w-full font-bold">
          <li className="w-full">
            <Link
              href="/words4/allwords4"
              className="block px-4 py-2 text-lg text-white hover:bg-blue-800 bg-purple-800 rounded-lg text-center"
            >
              B2 Words
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/lessons4/less4"
              className="block px-4 py-2 text-lg text-white hover:bg-blue-800 bg-purple-800 rounded-lg text-center"
            >
              Lessons for B2 Level
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/themes4/allthemes4"
              className="block px-4 py-2 text-lg text-white hover:bg-blue-800 bg-purple-800 rounded-lg text-center"
            >
              B2 Themes
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LevPage;
