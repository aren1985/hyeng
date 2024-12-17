"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();
  const cache = useRef({}); // Caching mechanism

  useEffect(() => {
    if (title) {
      // Check if we have cached data for this title
      if (cache.current[title]) {
        setLesson(cache.current[title]);
        setLoading(false);
      } else {
        // Fetch lesson using then/catch
        axios
          .get(
            `http://localhost:3033/documents/lessdocuments/${encodeURIComponent(
              title
            )}`
          )
          .then((response) => {
            console.log(response); // Check the data returned
            if (response.data && response.data.length > 0) {
              setLesson(response.data[0]); // Assuming the response data is an array, use the first item
              cache.current[title] = response.data[0]; // Cache the response
            } else {
              setError("No lesson found.");
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching lesson:", err);
            setError("Failed to load lesson. Please try again later.");
            setLoading(false);
          });
      }
    }
  }, [title]);

  const speakWord = (word) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };

  const nextTheme = () => {
    if (currentThemeIndex < lesson.themes.length - 1) {
      setCurrentThemeIndex(currentThemeIndex + 1);
    } else {
      // Redirect to the next quiz page when finished
      router.push(`/lessons/less1quiz?title=${title}`);
    }
  };

  // Loading or error handling
  if (loading) return <p>Loading lesson...</p>;
  if (error) return <p>{error}</p>;
  if (!lesson) return <p>No lesson found.</p>;

  const currentTheme = lesson.themes[currentThemeIndex] || {};

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-6">
        {lesson.title}
      </h1>
      <h2 className="text-md md:text-xl text-green-800 shadow-md p-2 font-semibold mb-4">
        {currentTheme.themeTitle}
      </h2>

      {/* Render words with English and Armenian translations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentTheme.words.map((word) => (
          <div
            key={word._id}
            className="flex items-center justify-between p-4 border border-gray-200 shadow rounded-lg bg-white"
          >
            <div>
              <p className="text-lg font-medium text-gray-900">
                {word.english}
              </p>
              <p className="text-md text-gray-500">{word.armenian}</p>
            </div>
            <button
              onClick={() => speakWord(word.english)}
              className="text-blue-500 ml-4 shadow-md p-2"
              aria-label={`Listen to ${word.english}`}
            >
              <FaVolumeUp className="text-xl" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={nextTheme}
        className="bg-green-500 text-white py-2 px-6 rounded mt-6 text-lg font-semibold"
      >
        Next Theme
      </button>
    </div>
  );
};

export default LessonPage;
