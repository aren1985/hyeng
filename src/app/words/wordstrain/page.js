"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";

const Wordstrain = () => {
  const [words, setWords] = useState([]);
  const [userTranslation, setUserTranslation] = useState("");
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/words/wordik/${title}`)
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

    // Get available voices and select a specific one
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      voice.name.includes("Samantha")
    ); // Example: iOS English voice

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (
      words[currentIndex]?.english.toLowerCase() ===
      userTranslation.trim().toLowerCase()
    ) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setAttempted(true);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserTranslation("");
      setIsCorrect(null);
      setAttempted(false);
    } else {
      // Navigate to next page when all words are finished
      router.push(`/words/words2?title=${encodeURIComponent(title)}`);
    }
  };

  const handleRetry = () => {
    setIsCorrect(null);
    setAttempted(false);
    setUserTranslation("");
  };

  const goToNextPage = () => {
    router.push(`/words/words2?title=${encodeURIComponent(title)}`);
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="bg-purple-800 text-gray-200 text-xl md:text-2xl py-2 px-6 font-bold mt-5 mb-5 rounded">
        training
      </h1>
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Translate English
      </h1>

      {words.length > 0 && currentIndex < words.length ? (
        <div className="flex flex-col items-center w-full max-w-xl">
          <div className="mb-6 p-4 border border-gray-200 shadow-lg rounded-lg bg-white w-full">
            {/* Display Armenian word */}
            <p className="text-lg p-3 font-medium text-white bg-gray-900 text-center rounded">
              {words[currentIndex]?.armenian}
            </p>
            <input
              type="text"
              value={userTranslation}
              onChange={(e) => setUserTranslation(e.target.value)}
              placeholder="Enter English translation"
              className="mt-2 p-3 border border-gray-800 rounded w-full"
            />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={checkAnswer}
                className="bg-purple-700 hover:bg-purple-500 text-white p-2 rounded font-medium"
              >
                Check Answer
              </button>
              <button
                onClick={() => speakWord(words[currentIndex]?.english)}
                className="text-white bg-purple-700 hover:bg-purple-500 rounded p-2 flex gap-1 font-medium"
                aria-label={`Listen to ${words[currentIndex]?.english}`}
              >
                <p>Listen English</p>
                <FaVolumeUp className="text-2xl shadow-md" />
              </button>
            </div>

            {attempted && (
              <div
                className={`mt-4 p-3 rounded-lg font-bold text-white ${
                  isCorrect ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect!"}
              </div>
            )}
          </div>

          {attempted && !isCorrect && (
            <div className=" p-4 border border-green-500 rounded-lg bg-red-100 w-full">
              <h3 className="font-bold text-green-600">Correct Answer</h3>
              <p>{words[currentIndex]?.english}</p>
            </div>
          )}

          <div className="mt-4 flex gap-4 w-full">
            <button
              onClick={handleNext}
              className="bg-purple-700 hover:bg-purple-500  text-white p-3 w-1/2 text-lg rounded shadow-lg font-bold border-2 border-white"
            >
              next word
            </button>
            <button
              onClick={handleRetry}
              className="bg-yellow-600 hover:bg-yellow-400 text-white p-3 w-1/2 text-lg rounded shadow-lg font-bold border-2 border-white"
            >
              try again
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
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

export default function WordstrainPage() {
  return (
    <Suspense>
      <Wordstrain />
    </Suspense>
  );
}
