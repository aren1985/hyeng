"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Import feedback images
import correctImage from "../../images/newlike.webp";
import incorrectImage from "../../images/dislike.webp";
const Modal = ({ visible, imageSrc, onNext, isCorrect }) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div
        className={`p-6 rounded-lg flex flex-col items-center ${
          isCorrect ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <Image src={imageSrc} alt="Feedback" width={200} height={200} />
        <button
          onClick={onNext}
          className={`${
            imageSrc === incorrectImage ? "bg-red-600" : "bg-green-600"
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }} // Match width to image
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

const QuizPage2 = () => {
  const [lesson, setLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();
  const cache = useRef({});

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch lesson data and shuffle words
  useEffect(() => {
    if (title) {
      if (cache.current[title]) {
        const cachedLesson = cache.current[title];
        setLesson(cachedLesson);
        const shuffled = shuffleArray(cachedLesson.themes[0].words);
        setShuffledWords(shuffled); // Store shuffled words
        setLoading(false);
      } else {
        axios
          .get(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/documents3/lessdocuments3/${encodeURIComponent(title)}`
          )
          .then((response) => {
            if (response.data && response.data.length > 0) {
              const fetchedLesson = response.data[0];
              setLesson(fetchedLesson);
              cache.current[title] = fetchedLesson;
              const shuffled = shuffleArray(fetchedLesson.themes[0].words);
              setShuffledWords(shuffled); // Store shuffled words
              setLoading(false);
            } else {
              setError("No lesson found.");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Error fetching lesson:", err);
            setError("Failed to load lesson. Please try again later.");
            setLoading(false);
          });
      }
    }
  }, [title]);

  const checkAnswer = () => {
    const correctAnswer = shuffledWords[currentWordIndex].english.toLowerCase();

    if (userInput.trim().toLowerCase() === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }

    setModalVisible(true); // Show modal
  };

  const nextWord = () => {
    if (currentWordIndex < shuffledWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setIsCorrect(null);
      setUserInput("");
    } else {
      router.push(`/lessons3/less3quiz?title=${title}`);
    }
    setModalVisible(false); // Hide modal
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-700 text-lg font-medium">Loading ...</p>
      </div>
    );
  if (error) return <p>{error}</p>;
  if (!lesson) return <p>No lesson found.</p>;

  const currentWord = shuffledWords[currentWordIndex] || {};

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl  text-blue-800 font-bold mb-6">{lesson.title}</h1>
      <h2 className="text-2xl  text-purple-800 font-semibold mb-4">
        write english
      </h2>

      <div className="mb-6">
        <p className="text-lg bg-gray-800  text-white shadow-md py-1 rounded px-6 font-semibold">
          {currentWord.armenian}
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter the English translation"
          className="py-2 px-4 rounded-lg text-lg border-2 border-gray-800"
        />
      </div>

      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextWord}
      />
    </div>
  );
};

export default function Qz2() {
  return (
    <Suspense>
      <QuizPage2 />
    </Suspense>
  );
}
