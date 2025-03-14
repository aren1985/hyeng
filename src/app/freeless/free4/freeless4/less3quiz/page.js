"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaVolumeUp } from "react-icons/fa";
import correctImage from "../../../../images/newlike.webp";
import incorrectImage from "../../../../images/dislike.webp";
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
            }/documents4/lessdocuments4/${encodeURIComponent(title)}`
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
      router.push(`/freeless/free4/freeless4/less4quiz?title=${title}`);
    }

    setModalVisible(false);
  };

  const speakWord = () => {
    // Get the current word from the lesson
    const currentWord = lesson.themes[0].words[currentWordIndex].english;

    // Create the SpeechSynthesisUtterance for the word
    const speech = new SpeechSynthesisUtterance(currentWord);
    speech.lang = "en-GB"; // Set language to British English (you can change it to "en-US" or any other)
    speech.rate = 0.8; // Adjust the speed of speech

    // Get available voices and select a specific one
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Samantha") // Example: iOS English voice, you can modify this to your desired voice
    );

    // Assign the preferred voice if found
    if (preferredVoice) {
      speech.voice = preferredVoice;
    }

    // Speak the word
    window.speechSynthesis.speak(speech);

    // Ensure options are generated after the word is spoken
    generateOptions(lesson); // Regenerate options
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
        className="bg-orange-600 text-white py-2 px-6 rounded mt-2 mb-4 text-md font-semibold flex items-center gap-2"
      >
        <FaVolumeUp className="text-2xl" />
        Listen
      </button>

      <div className="mb-6 flex flex-col items-center gap-1 w-64">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            className={`${
              selectedAnswer === option
                ? "bg-blue-500"
                : "bg-blue-800 hover:bg-blue-500"
            } text-white py-2 px-6 rounded m-2  text-lg w-full font-semibold`}
          >
            {option}
          </button>
        ))}
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

export default function Qv3() {
  return (
    <Suspense>
      <QuizPage3 />
    </Suspense>
  );
}
