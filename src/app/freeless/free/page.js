"use client";

import React from "react";
import Link from "next/link";

const levels = [
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
      { href: "/freeless/a2free", text: "A2 Lesson" },
      { href: "/freeless/a2theme", text: "A2 Theme" },
      { href: "/freeless/a2words", text: "A2 Words" }, // Added A2 Words for consistency
    ],
  },
  {
    title: "B1 Level",
    links: [
      { href: "/freeless/b1free", text: "B1 Lesson" },
      { href: "/freeless/b1theme", text: "B1 Theme" }, // Added B1 Theme for consistency
      { href: "/freeless/b1words", text: "B1 Words" }, // Added B1 Words for consistency
    ],
  },
  {
    title: "B2 Level",
    links: [
      { href: "/freeless/b2free", text: "B2 Lesson" },
      { href: "/freeless/b2theme", text: "B2 Theme" }, // Added B2 Theme for consistency
      { href: "/freeless/b2words", text: "B2 Words" }, // Added B2 Words for consistency
    ],
  },
  {
    title: "Images",
    links: [{ href: "/freeless/imagefree", text: "Learn by Images" }],
  },
];

const FreeLessons = () => {
  return (
    <div className="flex flex-col items-center gap-10 w-full mt-10">
      <div className="text-lg font-semibold text-purple-800 bg-white text-center p-4 rounded-lg shadow-md">
        <p>
          Free page for getting acquainted and getting an idea of the class
          procedure
        </p>
        <p>
          Անվճար էջ ծանոթանալու և պատկերացում կազմելու դասերի ընթացակարգի համար
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {levels.map((level, index) => (
          <div
            key={index}
            className="relative w-64 h-64 cursor-pointer group perspective-1000"
          >
            <div className="absolute inset-0 bg-purple-700 flex flex-col justify-center items-center text-white text-xl font-bold rounded-lg shadow-md transform-style-preserve-3d group-hover:rotate-y-180 transition-transform duration-500">
              {level.title}
              <p className="text-sm mt-2">Words, Lessons & Themes</p>
            </div>
            <div className="absolute inset-0 bg-white p-4 flex flex-col items-center justify-center rounded-lg shadow-md transform rotate-y-180 opacity-0 group-hover:opacity-100 group-hover:rotate-y-0 transition-all duration-500">
              <ul className="space-y-2 text-center">
                {level.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-blue-800 shadow-md"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeLessons;
