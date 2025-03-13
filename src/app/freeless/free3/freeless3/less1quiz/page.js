"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";
import Image from "next/image";

// Import images directly from the Images folder
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
          style={{ maxWidth: "200px" }} // Match width to image
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

const QuizPage = () => {
  const [lesson, setLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]); // For current word options
  const [shuffledWords, setShuffledWords] = useState([]); // For shuffled words
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
            setError("Failed to load lesson. Please try again later.");
            setLoading(false);
          });
      }
    }
  }, [title]);

  const generateOptions = (wordIndex) => {
    if (!lesson || !lesson.themes || !lesson.themes[0].words) return;

    const correctOption = shuffledWords[wordIndex]?.armenian;
    if (!correctOption) {
      return;
    }

    const allWords = lesson.themes[0].words;

    let options = [correctOption];
    while (options.length < 3) {
      const randomWord =
        allWords[Math.floor(Math.random() * allWords.length)]?.armenian;
      if (randomWord && !options.includes(randomWord)) {
        options.push(randomWord);
      }
    }

    setCurrentOptions(shuffleArray(options)); // Shuffle options for randomness
  };

  const speakWord = (word) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-GB"; // Set language (British English)

    // Adjust the rate (speed) of speech
    utterance.rate = 0.8;

    // Get available voices and select a specific one
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Samantha") // Example: iOS English voice
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice; // Set preferred voice
    }

    // Speak the word
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    const correctAnswer = shuffledWords[currentWordIndex].armenian;
    if (selectedAnswer === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setIsChecked(true);
    setModalVisible(true);
  };

  const nextWord = () => {
    if (currentWordIndex < shuffledWords.length - 1) {
      const newIndex = currentWordIndex + 1;
      setCurrentWordIndex(newIndex);
      generateOptions(newIndex); // Generate options for the next word
      setIsCorrect(null);
      setSelectedAnswer(null);
      setIsChecked(false);
    } else {
      router.push(`/freeless/free3/freeless3/less2quiz?title=${title}`);
    }
    setModalVisible(false);
  };

  // Ensure that generateOptions is only called after lesson data is loaded and shuffled words are available
  useEffect(() => {
    if (shuffledWords.length > 0 && currentWordIndex === 0) {
      generateOptions(currentWordIndex); // Ensure options are generated for the first word
    }
  }, [shuffledWords, currentWordIndex]); // Dependency on shuffledWords and currentWordIndex

  // Check if the data is available before rendering
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
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="mb-6 text-center">
        <p className="text-purple-800 text-xl md:text-2xl font-semibold mb-2">
          finde a correct
        </p>

        <p className="text-lg text-white bg-gray-800 shadow-md px-3 py-2 font-semibold rounded">
          {currentWord.english}
        </p>
        <button
          onClick={() => speakWord(currentWord.english)}
          className="text-purple-800 mt-2 p-2 shadow-md"
          aria-label={`Listen to the word "${currentWord.english}"`}
        >
          <FaVolumeUp className="text-2xl shadow-md" />
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center ">
        {currentOptions.length > 0 ? (
          currentOptions.map((option, index) => (
            <button
              key={`${option}-${index}`} // Ensure key is unique
              className={`py-2 px-6 rounded-lg text-lg font-semibold w-64  ${
                selectedAnswer === option
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
              onClick={() => setSelectedAnswer(option)}
              disabled={isChecked} // Disable buttons after answer is checked
            >
              {option}
            </button>
          ))
        ) : (
          <p>No options available</p>
        )}
      </div>

      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        disabled={isChecked} // Disable Check button after answer is checked
      >
        Check Answer
      </button>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect} // Pass correctness to the modal for background color
        onNext={nextWord} // Pass nextWord to the modal
      />
    </div>
  );
};

export default function QPg() {
  return (
    <Suspense>
      <QuizPage />
    </Suspense>
  );
}
