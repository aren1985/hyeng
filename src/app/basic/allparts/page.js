"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "animals",
  "drinks",
  "clothes",
  "clothes2",
  "food",
  "fruits",
  "fruits2",
  "transports",
  "home",
  "professions",
  "nature",
  "nature1",
  "nature2",
  "nature3",
  "nature4",
  "nature5",
  "buildings",
  "buildings2",
  "buildings3",
  "buildings4",
  "electronic equipments",
];

const ITEMS_PER_PAGE = 10;

const CategorySelection = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const handleCategorySelect = (category) => {
    router.push(`/basic/learning?category=${encodeURIComponent(category)}`);
  };

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl md:text-3xl text-purple-800 font-bold mb-8 mt-6 shadow-lg p-3 rounded-lg bg-white">
        Select a Category
      </h1>
      <ul className="space-y-4 w-full max-w-md">
        {paginatedCategories.map((category) => (
          <li key={category} className="w-full">
            <button
              onClick={() => handleCategorySelect(category)}
              className="w-full bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all text-center capitalize"
            >
              {category}
            </button>
          </li>
        ))}
      </ul>

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
        <div className="flex items-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                index === page
                  ? "bg-purple-800 text-white"
                  : "bg-gray-300 hover:bg-purple-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(categories.length / ITEMS_PER_PAGE) - 1
              )
            )
          }
          disabled={endIndex >= categories.length}
          className={`px-2 py-2 rounded-lg font-semibold text-white transition-all ${
            endIndex >= categories.length
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

export default CategorySelection;
