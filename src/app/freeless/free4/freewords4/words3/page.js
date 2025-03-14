"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import correctImage from "../../../../images/newlike.webp";
import incorrectImage from "../../../../images/dislike.webp";
const Modal = ({ visible, imageSrc, onNext, isCorrect }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg flex flex-col items-center ${
          isCorrect ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <Image src={imageSrc} alt="Feedback" width={200} height={200} />
        <button
          onClick={onNext}
          className={`${
            isCorrect ? "bg-green-600" : "bg-red-600"
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }}
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

const Words3Page = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [options, setOptions] = useState([]);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/words4/wordik4/${title}`)
        .then((response) => {
          const fetchedWords = response.data.words || [];
          setWords(fetchedWords);
          shuffleWords(fetchedWords); // Shuffle words after fetching them
        })
        .catch(() => console.error("Failed to load words."));
    }
  }, [title]);

  const shuffleWords = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setWords(shuffled);
  };

  const generateOptions = () => {
    if (!words || words.length === 0) return;

    const currentWord = words[currentWordIndex];
    const correctOption = currentWord?.english; // Correct option should be the English translation

    let options = [correctOption];
    while (options.length < 4) {
      const randomWord =
        words[Math.floor(Math.random() * words.length)]?.english; // Random English translations
      if (randomWord && !options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    setOptions(shuffleArray(options)); // Shuffle options to randomize the order
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswer = () => {
    const correctAnswer = words[currentWordIndex]?.english; // Correct answer is the English translation
    const correct = selectedAnswer === correctAnswer;

    setIsCorrect(correct);
    setModalImage(correct ? correctImage : incorrectImage);
    setModalVisible(true);
  };

  const nextWord = () => {
    setModalVisible(false);
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      router.push(
        `/freeless/free4/freewords4/words4?title=${encodeURIComponent(title)}`
      );
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      generateOptions(); // Generate options when words are fetched and shuffled
    }
  }, [words, currentWordIndex]);

  if (words.length === 0)
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

  const currentWord = words[currentWordIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Find the correct
      </h1>

      <div className="mb-6 text-center">
        <p className="text-lg  py-2 px-3 rounded font-semibold text-white bg-gray-800 shadow-md">
          {currentWord?.armenian}
        </p>
      </div>

      <div className="flex flex-col gap-4 items-center text-lg">
        {options.map((option, index) => {
          // Use gray background when not selected and blue when selected
          const backgroundColor =
            selectedAnswer === option ? "bg-blue-400" : "bg-gray-200";

          return (
            <button
              key={index}
              className={`py-2 px-6 rounded-lg text-xl font-semibold w-64 ${backgroundColor}`}
              onClick={() => setSelectedAnswer(option)}
              disabled={modalVisible} // Disable only if the modal is visible
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Check Answer Button */}
      <button
        onClick={handleAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        disabled={selectedAnswer === null}
      >
        Check Answer
      </button>

      {/* Modal for correct/incorrect feedback */}
      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextWord}
      />
    </div>
  );
};

export default function W3Pg() {
  return (
    <Suspense>
      <Words3Page />
    </Suspense>
  );
}
