"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaVolumeUp } from "react-icons/fa";
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

const Modal = ({ visible, imageSrc, onNext, isCorrect }) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div
        className={`p-6 rounded-lg flex flex-col items-center ${
          isCorrect ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <Image src={imageSrc} alt="Feedback" width={200} height={200} />
        <button
          onClick={onNext}
          className={`${
            imageSrc === incorrectImage ? "bg-red-500" : "bg-green-500"
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }}
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

const QuizPage3 = () => {
  const [lesson, setLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();
  const cache = useRef({});

  useEffect(() => {
    if (title) {
      if (cache.current[title]) {
        setLesson(cache.current[title]);
        setLoading(false);
        generateOptions(cache.current[title]);
      } else {
        axios
          .get(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/documents/lessdocuments/${encodeURIComponent(title)}`
          )
          .then((response) => {
            if (response.data && response.data.length > 0) {
              setLesson(response.data[0]);
              cache.current[title] = response.data[0];
              generateOptions(response.data[0]);
            } else {
              setError("No lesson found.");
            }
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to load lesson.");
            setLoading(false);
          });
      }
    }
  }, [title]);

  // Function to generate random options and ensure correct word is in the list
  const generateOptions = (lessonData) => {
    const words = lessonData.themes[0].words;
    const correctAnswer = words[currentWordIndex].english;
    let newOptions = [correctAnswer]; // Start with the correct answer

    while (newOptions.length < 3) {
      const randomWord =
        words[Math.floor(Math.random() * words.length)].english;
      // Add random word if not already included
      if (!newOptions.includes(randomWord)) {
        newOptions.push(randomWord);
      }
    }

    // Shuffle the options
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const checkAnswer = () => {
    const correctAnswer =
      lesson.themes[0].words[currentWordIndex].english.toLowerCase();

    if (selectedAnswer.trim().toLowerCase() === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }

    setModalVisible(true);
  };

  const nextWord = () => {
    if (currentWordIndex < lesson.themes[0].words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setIsCorrect(null);
      setSelectedAnswer("");
      generateOptions(lesson); // Re-generate options with the next word
    } else {
      router.push(`/lessons/less4quiz?title=${title}`);
    }

    setModalVisible(false);
  };

  const speakWord = () => {
    const currentWord = lesson.themes[0].words[currentWordIndex].english;
    const speech = new SpeechSynthesisUtterance(currentWord);
    window.speechSynthesis.speak(speech);

    // Ensure options are generated after the word is spoken
    generateOptions(lesson); // Regenerate options
  };

  if (loading) return <p>Loading lesson...</p>;
  if (error) return <p>{error}</p>;
  if (!lesson) return <p>No lesson found.</p>;

  const currentWord = lesson.themes[0].words[currentWordIndex] || {};

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-blue-800 font-bold mb-6">
        {lesson.title}
      </h1>
      <h2 className="text-xl md:text-2xl text-purple-800 font-semibold mb-4">
        listen and choose
      </h2>

      <button
        onClick={speakWord}
        className="bg-orange-500 text-white py-2 px-6 rounded mt-2 mb-2 text-md font-semibold flex items-center gap-2"
      >
        <FaVolumeUp className="text-2xl" />
        Listen
      </button>

      <div className="mb-6 flex flex-col gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            className={`${
              selectedAnswer === option ? "bg-green-500" : "bg-blue-500"
            } text-white py-2 px-6 rounded m-2  text-lg w-full font-semibold`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={checkAnswer}
        className="bg-purple-700 text-white p-3 mt-6 w-full  rounded shadow-lg font-bold"
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

export default function Qv3() {
  return (
    <Suspense>
      <QuizPage3 />
    </Suspense>
  );
}
