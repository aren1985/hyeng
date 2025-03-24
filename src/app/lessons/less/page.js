"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Example of lessons with MongoDB _id and title
const lessons = [
  { _id: "60d9f7f2e4b0b4d85b97eaf8", title: "lesson1" },
  { _id: "60d9f7f2e4b0b4d85b97eaf9", title: "lesson2" },

  // Add more lessons as needed with _id
];

const ITEMS_PER_PAGE = 10; // You can change this to adjust the number of lessons per page

const LessonSelection = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const handleLessonSelect = (lessonId, lessonTitle) => {
    // Navigate to the lesson page with the lesson title as a search param
    router.push(
      `/lessons/lessvideo1?title=${encodeURIComponent(
        lessonTitle
      )}&_id=${encodeURIComponent(lessonId)}`
    );
  };

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLessons = lessons.slice(startIndex, endIndex);
  const totalPages = Math.ceil(lessons.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold bg-white py-1 px-6 rounded-lg text-purple-800 mb-8 text-center transform-gpu shadow-2xl">
        Select a Lesson
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {paginatedLessons.map((lesson) => (
          <button
            key={lesson._id}
            onClick={() => handleLessonSelect(lesson._id, lesson.title)}
            className="bg-purple-800 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            {lesson.title}
          </button>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-6 w-full max-w-md">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
            page === 0
              ? "bg-yellow-700 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2 items-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                page === index
                  ? "bg-yellow-700 text-white"
                  : "bg-purple-800 text-white hover:bg-blue-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
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

export default LessonSelection;
