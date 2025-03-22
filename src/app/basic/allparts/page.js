"use client";

import React from "react";
import { useRouter } from "next/navigation";

const categories = [
  "animals",
  "drinks",
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
];

const CategorySelection = () => {
  const router = useRouter();

  const handleCategorySelect = (category) => {
    router.push(`/basic/learning?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl md:text-3xl text-purple-800 font-bold mb-8 mt-6 shadow-lg p-3 rounded-lg bg-white">
        Select a Category
      </h1>
      <ul className="space-y-4 w-full max-w-md">
        {categories.map((category) => (
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
    </div>
  );
};

export default CategorySelection;
