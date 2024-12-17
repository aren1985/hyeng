"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

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
        .get(`http://localhost:3033/words/wordik/${title}`)
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

  const handleAnswer = (answer) => {
    const correctAnswer = words[currentWordIndex]?.english; // Correct answer is the English translation
    const correct = answer === correctAnswer;

    setIsCorrect(correct);
    setModalImage(correct ? correctImage : incorrectImage);
    setModalVisible(true);
    setSelectedAnswer(answer);
  };

  const nextWord = () => {
    setModalVisible(false);
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      router.push(`/words/words4?title=${encodeURIComponent(title)}`);
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      generateOptions(); // Generate options when words are fetched and shuffled
    }
  }, [words, currentWordIndex]);

  if (words.length === 0) return <p>Loading...</p>;

  const currentWord = words[currentWordIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        find the correct
      </h1>

      {/* Display Armenian word */}
      <div className="mb-6 text-center">
        <p className="text-md md:text-xl p-1 font-bold text-green-800 shadow-md">
          {currentWord?.armenian}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4   items-center">
        {options.map((option, index) => {
          const isSelected = option === selectedAnswer;
          const isCorrectOption = option === words[currentWordIndex]?.english;
          const backgroundColor = isSelected
            ? isCorrectOption
              ? "bg-green-500"
              : "bg-red-500"
            : "bg-gray-200";

          return (
            <button
              key={index}
              className={`py-2 px-6 rounded-lg text-lg font-bold ${backgroundColor}`}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextWord}
      />
    </div>
  );
};

export default Words3Page;
