"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Example of lessons with MongoDB _id and title
const lessons = [
  { _id: "67a5dbc2a290a9e9fc399658", title: "words for 81 day" },
  // Add more lessons here
];

const ITEMS_PER_PAGE = 10; // Adjust as needed

const LessonSelection = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const handleLessonSelect = (lessonId, lessonTitle) => {
    router.push(
      `/words3/words1?title=${encodeURIComponent(
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
      <h1 className="text-xl md:text-2xl py-1 px-6 rounded-lg font-bold bg-white text-purple-800 mb-8 text-center transform-gpu shadow-2xl">
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6 w-full max-w-md">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`px-2 py-2 rounded-lg font-semibold text-white transition-all ${
            page === 0
              ? "bg-yellow-700 cursor-not-allowed"
              : "bg-green-800 hover:bg-blue-600"
          }`}
        >
          Prev
        </button>

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
              : "bg-green-800 hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LessonSelection;
