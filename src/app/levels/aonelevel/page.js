"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SelectionPage = () => {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const lessons = [
    { _id: "6807a72a62d72d5b930975ab", title: "lesson1" },
    { _id: "6807a72a62d72d5b930975ab", title: "lesson2" },
    { _id: "6807a72a62d72d5b930975ab", title: "lesson3" },
    // Add more lessons as needed
  ];

  const themes = [
    { _id: "68079be262d72d5b930975a4", title: "summary" },
    { _id: "68079be262d72d5b930975a4", title: "summary2" },
    { _id: "68079be262d72d5b930975a4", title: "summary3" },
    // Add more themes as needed
  ];

  const words = [
    { _id: "680672f9d4f6899b6173457c", title: "words for 1 day" },
    { _id: "680672f9d4f6899b6173457c", title: "words for 2 day" },
    { _id: "680672f9d4f6899b6173457c", title: "words for 3 day" },
    // Add more words as needed
  ];

  const cardsPerPage = 10;
  const totalPages = Math.ceil(lessons.length / cardsPerPage);

  // Determine which cards should be displayed based on the current page
  const cardData = Array.from({ length: cardsPerPage })
    .map((_, index) => {
      const lessonIndex = (currentPage - 1) * cardsPerPage + index;
      return {
        day: `Day ${lessonIndex + 1}`,
        lesson: lessons[lessonIndex],
        theme: themes[lessonIndex],
        word: words[lessonIndex],
      };
    })
    .filter((card) => card.lesson && card.theme && card.word); // Filter out any empty cards

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

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-purple-800  border-2 border-purple-800 py-2 px-6 mb-10 text-center rounded transform-gpu">
        Select Day
      </h1>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl justify-items-center">
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
              <div className="absolute inset-0 bg-gray-300 p-4 flex flex-col items-center justify-center rounded-lg shadow-md">
                <ul className="space-y-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from closing when clicking button
                      handleSelect("words", card.word._id, card.word.title);
                    }}
                    className="bg-orange-800 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-200 ease-in-out w-full text-center"
                  >
                    {card.word.title}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from closing when clicking button
                      handleSelect(
                        "lessons",
                        card.lesson._id,
                        card.lesson.title
                      );
                    }}
                    className="bg-blue-800 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-200 ease-in-out mb-4 w-full text-center"
                  >
                    {card.lesson.title}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from closing when clicking button
                      handleSelect("themes", card.theme._id, card.theme.title);
                    }}
                    className="bg-green-800 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gradient-to-l transition duration-200 ease-in-out mb-4 w-full text-center"
                  >
                    {card.theme.title}
                  </button>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex justify-center items-center w-full max-w-4xl">
        <button
          onClick={prevPage}
          className="bg-green-800 text-white py-2 px-2 font-semibold rounded-lg hover:bg-purple-600 disabled:bg-yellow-700"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {/* Pagination numbers */}
        <div className="flex space-x-1 mx-4">
          {[...Array(totalPages)].map((_, pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber + 1)}
              className={`py-1 px-3 rounded-lg ${
                currentPage === pageNumber + 1
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-black hover:bg-purple-600"
              }`}
            >
              {pageNumber + 1}
            </button>
          ))}
        </div>

        <button
          onClick={nextPage}
          className="bg-green-800 text-white py-2 px-2 font-semibold rounded-lg hover:bg-purple-600 disabled:bg-yellow-700"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
