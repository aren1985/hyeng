"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";

const ThemePage = () => {
  const [sentences, setSentences] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const title = searchParams.get("title"); // Get title from query params
  const router = useRouter();

  useEffect(() => {
    if (title) {
      // Fetch sentences based on the title from query params
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes/themik/${title}`)
        .then((response) => {
          setSentences(response.data.sentences || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching sentences:", err);
          setError("Failed to load sentences. Please try again.");
          setLoading(false);
        });
    }
  }, [title]);

  const speakSentence = (sentence) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const goToNextPage = () => {
    router.push(`/themes/theme2?title=${encodeURIComponent(title)}`);
  };

  if (error) return <p className="text-red-600">{error}</p>;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-700 text-lg font-medium">
          Loading theme...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Listen And Learn
      </h1>

      {sentences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {sentences.map((sentence, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 shadow-lg rounded-lg bg-white"
            >
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {sentence.englishsentence}
                </p>
                <p className="text-md text-gray-500">
                  {sentence.armeniansentence}
                </p>
              </div>
              <button
                onClick={() => speakSentence(sentence.englishsentence)}
                className="text-blue-500 ml-4 shadow-md p-2"
                aria-label={`Listen to ${sentence.englishsentence}`}
              >
                <FaVolumeUp className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No sentences available for this title.</p>
      )}

      <button
        onClick={goToNextPage}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Next
      </button>
    </div>
  );
};

export default function ThemP() {
  return (
    <Suspense>
      <ThemePage />
    </Suspense>
  );
}
