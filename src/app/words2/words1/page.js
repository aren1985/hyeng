"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";

const W1Page = () => {
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const title = searchParams.get("title"); // Get title from query params
  const router = useRouter();

  useEffect(() => {
    if (title) {
      // Fetch words based on the title from query params
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/words2/wordik2/${title}`)
        .then((response) => {
          setWords(response.data.words || []);
        })
        .catch((err) => {
          console.error("Error fetching words:", err);
          setError("Failed to load words. Please try again.");
        });
    }
  }, [title]);

  const speakWord = (word) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const goToNextPage = () => {
    router.push(`/words2/words2?title=${encodeURIComponent(title)}`);
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">{` ${title}`}</h1>

      {words.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 shadow-lg rounded-lg bg-white"
            >
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {word.english}
                </p>
                <p className="text-md text-gray-500">{word.armenian}</p>
              </div>
              <button
                onClick={() => speakWord(word.english)}
                className="text-blue-500 ml-4 p-2"
                aria-label={`Listen to ${word.english}`}
              >
                <FaVolumeUp className="text-xl shadow-md " />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 text-lg font-medium">
            Loading words...
          </p>
        </div>
      )}

      <button
        onClick={goToNextPage}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg rounded shadow-lg font-bold border-2 border-white"
      >
        Next
      </button>
    </div>
  );
};

export default function valo() {
  return (
    <Suspense>
      <W1Page />
    </Suspense>
  );
}
