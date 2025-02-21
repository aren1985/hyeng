/*"use client";

import { useRouter } from "next/navigation";

// Example of lessons with MongoDB _id and title
const lessons = [
  { _id: "60d9f7f2e4b0b4d85b97eaf8", title: "words for 1 day" },
  { _id: "60d9f7f2e4b0b4d85b97eaf9", title: "words for 2 day" },
  // Add more lessons as needed with _id
];

const LessonSelection = () => {
  const router = useRouter();

  const handleLessonSelect = (lessonId, lessonTitle) => {
    // Navigate to the Word Selection page with the title as a query param
    router.push(
      `/words/words1?title=${encodeURIComponent(
        lessonTitle
      )}&_id=${encodeURIComponent(lessonId)}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center  p-6">
      <h1
        className="text-xl md:text-4xl font-bold text-purple-800 mb-8 text-center 
        transform-gpu shadow-2xl"
      >
        Select a Lesson
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {lessons.map((lesson) => (
          <button
            key={lesson._id}
            onClick={() => handleLessonSelect(lesson._id, lesson.title)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSelection;*/
