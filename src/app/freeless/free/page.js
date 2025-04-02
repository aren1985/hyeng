"use client";

import React, { useState } from "react";
import Link from "next/link";

const levels = [
  {
    title: "Images",
    links: [{ href: "/freeless/freeimage/freeim", text: "Learn by Images" }],
  },
  {
    title: "A1 Level",
    links: [
      { href: "/freeless/free1/freewords", text: "A1 Words" },
      { href: "/freeless/free1/freelessik", text: "A1 Lesson" },
      { href: "/freeless/free1/freetheme", text: "A1 Theme" },
    ],
  },
  {
    title: "A2 Level",
    links: [
      { href: "/freeless/free2/freewords", text: "A2 Words" },
      { href: "/freeless/free2/freelessik", text: "A2 Lesson" },
      { href: "/freeless/free2/freetheme", text: "A2 Theme" },
    ],
  },
  {
    title: "B1 Level",
    links: [
      { href: "/freeless/free3/freewords", text: "B1 Words" },
      { href: "/freeless/free3/freelessik", text: "B1 Lesson" },
      { href: "/freeless/free3/freetheme", text: "B1 Theme" },
    ],
  },
  {
    title: "B2 Level",
    links: [
      { href: "/freeless/free4/freewords", text: "B2 Words" },
      { href: "/freeless/free4/freelessik", text: "B2 Lesson" },
      { href: "/freeless/free4/freetheme", text: "B2 Theme" },
    ],
  },
];

const FreeLessons = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleClick = (index) => {
    if (hoveredIndex !== index) {
      setHoveredIndex(index);
    } else {
      setHoveredIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full mt-10 mb-10">
      <div className="text-lg font-semibold text-purple-800 text-center shadow-md">
        <p className="text-xl border-2 border-green-500 bg-gray-800 p-3 rounded">
          Free section to get acquainted with the class procedure
        </p>
        <p className="bg-gray-800 text-gray-300 p-3 rounded border-2 border-green-500">
          <em>Անվճար բաժին դասերի ընթացակարգին ծանոթանալու համար</em>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {levels.map((level, index) => (
          <div
            key={index}
            className="relative w-64 h-64 cursor-pointer"
            onClick={() => handleClick(index)}
          >
            {/* Card Front */}
            <div
              className={`absolute inset-0 bg-purple-700 flex flex-col justify-center items-center text-white text-xl font-bold rounded-lg shadow-md transition-transform duration-500 ${
                hoveredIndex === index ? "rotate-y-180 opacity-0" : ""
              }`}
            >
              {level.title}
              <p className="text-sm mt-2">Words, Lessons & Themes</p>
            </div>

            {/* Card Back (Links) */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-white p-4 flex flex-col items-center justify-center rounded-lg shadow-md">
                <ul className="space-y-2 text-center">
                  {level.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="block font-semibold px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-blue-800 shadow-md"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeLessons;
