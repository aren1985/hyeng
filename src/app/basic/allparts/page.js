"use client";

import React from "react";
import { useRouter } from "next/navigation";

const categories = ["animals", "drinks", "transports", "home features"]; // Your defined categories

const CategorySelection = () => {
  const router = useRouter();

  const handleCategorySelect = (category) => {
    // Navigate to the ImagesPage with the selected category
    router.push(`/basic/learning?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-4 mt-4">
        Select a Category
      </h1>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => handleCategorySelect(category)}
              className="bg-blue-500 font-bold  text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelection;
