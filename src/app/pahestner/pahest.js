"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBook, FaComments, FaRegFileAlt } from "react-icons/fa";

const SelectionPage = () => {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const lessons = [
    { _id: "60d9f7f2e4b0b4d85b97eaf8", title: "lesson1" },
    { _id: "60d9f7f2e4b0b4d85b97eaf9", title: "lesson2" },
  ];

  const themes = [
    { _id: "60d9f7f2e4b0b4d85b97eaf8", title: "meeting" },
    { _id: "60d9f7f2e4b0b4d85b97eaf9", title: "meeting2" },
  ];

  const words = [
    { _id: "60d9f7f2e4b0b4d85b97eaf8", title: "words for 1 day" },
    { _id: "60d9f7f2e4b0b4d85b97eaf9", title: "words for 2 day" },
  ];

  const cardData = Array.from({ length: 2 }).map((_, index) => ({
    day: `Day ${index + 1}`,
    lesson: lessons[index],
    theme: themes[index],
    word: words[index],
  }));

  const handleSelect = (type, _id, title) => {
    let path = "";

    if (type === "lessons") {
      path = `/lessons/lessvideo1?title=${encodeURIComponent(
        title
      )}&_id=${encodeURIComponent(_id)}`;
    } else if (type === "themes") {
      path = `/themes/theme1?title=${encodeURIComponent(
        title
      )}&_id=${encodeURIComponent(_id)}`;
    } else if (type === "words") {
      path = `/words/words1?title=${encodeURIComponent(
        title
      )}&_id=${encodeURIComponent(_id)}`;
    }

    router.push(path);
  };

  const handleClick = (index) => {
    if (hoveredIndex !== index) {
      setHoveredIndex(index);
    } else {
      setHoveredIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center transform-gpu shadow-2xl">
        Select Categories
      </h1>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center w-64 h-64 cursor-pointer"
            onClick={() => handleClick(index)}
          >
            {/* Card Front */}
            <div
              className={`absolute inset-0 bg-purple-700 flex flex-col justify-center items-center text-white text-xl font-bold rounded-lg shadow-md transition-transform duration-500 ${
                hoveredIndex === index ? "rotate-y-180 opacity-0" : ""
              }`}
            >
              <p>{card.day}</p>
              <p className="text-sm mt-2">Words, Lessons & Themes</p>
            </div>

            {/* Card Back (Links) */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-white p-4 flex flex-col items-center justify-center rounded-lg shadow-md">
                <ul className="space-y-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from closing when clicking button
                      handleSelect(
                        "lessons",
                        card.lesson._id,
                        card.lesson.title
                      );
                    }}
                    className="flex items-center bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-200 ease-in-out mb-4"
                  >
                    <FaBook className="mr-3" />
                    Lesson: {card.lesson.title}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from closing when clicking button
                      handleSelect("themes", card.theme._id, card.theme.title);
                    }}
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-200 ease-in-out mb-4"
                  >
                    <FaComments className="mr-3" />
                    Theme: {card.theme.title}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from closing when clicking button
                      handleSelect("words", card.word._id, card.word.title);
                    }}
                    className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-400 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-200 ease-in-out"
                  >
                    <FaRegFileAlt className="mr-3" />
                    Word: {card.word.title}
                  </button>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionPage;
