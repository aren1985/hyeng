"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";

const ImageTrainPage = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const router = useRouter();

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/images/allik/${selectedCategory}`
        )
        .then((response) => {
          setImages(response.data);
        })
        .catch((err) => {
          console.error("Error fetching images:", err);
          setError("Failed to load images. Please try again.");
        });
    }
  }, [selectedCategory]);

  const speakName = (name) => {
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = "en-GB"; // Explicitly set language to US English
    utterance.rate = 0.8;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Find a preferred voice, e.g., "Samantha" for iOS English
    const preferredVoice = voices.find((voice) =>
      voice.name.includes("Samantha")
    );

    // Set the preferred voice if available
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Speak the name
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (
      userInput.trim().toLowerCase() ===
      images[currentIndex]?.name.toLowerCase()
    ) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    setAttempted(true);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setFeedback(null);
      setAttempted(false);
    } else {
      router.push(`/basic/next-quiz?category=${selectedCategory}`);
    }
  };

  const goNextPage = () => {
    router.push(`/basic/next-quiz?category=${selectedCategory}`);
  };

  const retry = () => {
    setFeedback(null);
    setAttempted(false);
    setUserInput("");
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

      {images.length > 0 && currentIndex < images.length ? (
        <div className="flex flex-col items-center w-full max-w-xl">
          <div className="mb-6 p-4 border border-gray-200 shadow-lg rounded-lg bg-white w-full">
            {/* Display Armenian name */}
            <p className="text-lg p-3 font-medium text-white bg-gray-900 text-center">
              {images[currentIndex]?.armenianName}
            </p>

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter the English name"
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
                onClick={() => speakName(images[currentIndex]?.name)}
                className="text-white bg-purple-700 hover:bg-purple-500 rounded p-2 flex gap-1 font-medium"
                aria-label={`Listen to ${images[currentIndex]?.name}`}
              >
                <p>Listen English</p>
                <FaVolumeUp className="text-2xl shadow-md" />
              </button>
            </div>

            {attempted && (
              <div
                className={`mt-4 p-3 rounded-lg font-bold text-white ${
                  feedback === "correct" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {feedback === "correct" ? "Correct!" : "Incorrect!"}
              </div>
            )}
          </div>

          {attempted && feedback === "incorrect" && (
            <div className="p-4 border border-green-500 rounded-lg bg-red-100 w-full">
              <h3 className="font-bold text-green-600">Correct Answer</h3>
              <p>{images[currentIndex]?.name}</p>
            </div>
          )}

          <div className="mt-4 flex gap-4 w-full">
            <button
              onClick={nextImage}
              className="bg-purple-700 hover:bg-purple-500 text-white p-3 w-1/2 text-lg rounded shadow-lg font-bold border-2 border-white"
            >
              Next word
            </button>
            <button
              onClick={retry}
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
            Loading images...
          </p>
        </div>
      )}
      <button
        onClick={goNextPage}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg rounded shadow-lg font-bold border-2 border-white"
      >
        Next
      </button>
    </div>
  );
};

export default function ImageTrainWrapper() {
  return (
    <Suspense>
      <ImageTrainPage />
    </Suspense>
  );
}
