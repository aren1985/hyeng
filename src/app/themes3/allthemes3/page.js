"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Example of themes with MongoDB _id and title
const themes = [
  { _id: "67a4c2e256ee14e9f42360c5", title: "at the market" },

  // Add more themes as needed with _id
];

const ITEMS_PER_PAGE = 10; // You can adjust this number

const ThemeSelection = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const handleThemeSelect = (themeId, themeTitle) => {
    // Navigate to the Theme page with the title as a query param
    router.push(
      `/themes3/theme1?title=${encodeURIComponent(
        themeTitle
      )}&_id=${encodeURIComponent(themeId)}`
    );
  };

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedThemes = themes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(themes.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold px-3 py-2 rounded bg-white text-purple-800 mb-8 text-center transform-gpu shadow-2xl">
        Select a Theme
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {paginatedThemes.map((theme) => (
          <button
            key={theme._id}
            onClick={() => handleThemeSelect(theme._id, theme.title)}
            className="hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out bg-purple-800"
          >
            {theme.title}
          </button>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-6 w-full max-w-md">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`px-2 py-2 rounded-lg font-semibold text-white transition-all ${
            page === 0
              ? "bg-yellow-700 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1 items-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                page === index
                  ? "bg-purple-800 text-white"
                  : "bg-gray-300 hover:bg-purple-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className={`px-2 py-2 rounded-lg font-semibold text-white transition-all ${
            page === totalPages - 1
              ? "bg-yellow-700 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ThemeSelection;
