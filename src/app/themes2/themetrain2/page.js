"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";

const SentenceTrain = () => {
  const [sentences, setSentences] = useState([]);
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes2/themik2/${title}`)
        .then((response) => {
          setSentences(response.data.sentences || []);
        })
        .catch((err) => {
          console.error("Error fetching sentences:", err);
          setError("Failed to load sentences. Please try again.");
        });
    }
  }, [title]);

  const speakSentence = (sentence) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-GB"; // Set language to British English
    utterance.rate = 0.7; // Adjust speed for clarity

    // Get available voices and select a specific one if needed
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Samantha") // Change this to your preferred voice
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (
      sentences[currentIndex]?.englishsentence.toLowerCase() ===
      userTranslation.trim().toLowerCase()
    ) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setAttempted(true);
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserTranslation("");
      setIsCorrect(null);
      setAttempted(false);
    } else {
      // Navigate to next page when all sentences are finished
      router.push(`/themes2/theme2?title=${encodeURIComponent(title)}`);
    }
  };

  const handleRetry = () => {
    setIsCorrect(null);
    setAttempted(false);
    setUserTranslation("");
  };

  const goToNextPage = () => {
    router.push(`/themes2/theme2?title=${encodeURIComponent(title)}`);
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

      {sentences.length > 0 && currentIndex < sentences.length ? (
        <div className="flex flex-col items-center w-full max-w-xl">
          <div className="mb-6 p-4 border border-gray-200 shadow-lg rounded-lg bg-white w-full">
            {/* Display Armenian sentence */}
            <p className="text-lg p-2 font-medium text-white bg-gray-800 text-center">
              {sentences[currentIndex]?.armeniansentence}
            </p>

            <input
              type="text"
              value={userTranslation}
              onChange={(e) => setUserTranslation(e.target.value)}
              placeholder="Enter English translation"
              className="mt-2 p-2 border border-gray-800 rounded w-full"
            />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={checkAnswer}
                className="bg-purple-700 hover:bg-purple-500 text-white p-2 rounded font-medium"
              >
                Check Answer
              </button>
              <button
                onClick={() =>
                  speakSentence(sentences[currentIndex]?.englishsentence)
                }
                className="text-white bg-purple-700 hover:bg-purple-500 rounded p-2 flex gap-1 font-medium"
                aria-label={`Listen to ${sentences[currentIndex]?.englishsentence}`}
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
              <p>{sentences[currentIndex]?.englishsentence}</p>
            </div>
          )}

          <div className="mt-4 flex gap-4 w-full">
            <button
              onClick={handleNext}
              className="bg-purple-700 hover:bg-purple-500  text-white p-3 w-1/2 text-lg rounded shadow-lg font-bold border-2 border-white"
            >
              Next Sentence
            </button>
            <button
              onClick={handleRetry}
              className="bg-yellow-600 hover:bg-yellow-400 text-white p-3 w-1/2 text-lg rounded shadow-lg font-bold border-2 border-white"
            >
              Try Again
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
            Loading sentences...
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

export default function SentenceTrainPage() {
  return (
    <Suspense>
      <SentenceTrain />
    </Suspense>
  );
}
