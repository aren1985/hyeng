"use client";

import React from "react";
import Link from "next/link";

const Lev2Page = () => {
  return (
    <div className="flex flex-col items-center  min-h-screen ">
      <h1 className="text-xl md:text-2xl mt-7 py-1 px-6 rounded-lg bg-white font-bold text-purple-800 mb-6 shadow-md">
        Select a Category
      </h1>
      <div className=" shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center">
        <ul className="space-y-4 w-full font-bold">
          <li className="w-full">
            <Link
              href="/words2/allwords2"
              className="block px-4 py-2 text-lg text-white hover:text-blue-800 bg-purple-800 rounded-lg text-center"
            >
              A2 Words
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/themes2/allthemes2"
              className="block px-4 py-2 text-lg text-white hover:text-blue-800 bg-purple-800 rounded-lg text-center"
            >
              A2 Themes
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/lessons2/less2"
              className="block px-4 py-2 text-lg text-white hover:text-blue-800 bg-purple-800 rounded-lg text-center"
            >
              Lessons for A2 Level
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Lev2Page;
