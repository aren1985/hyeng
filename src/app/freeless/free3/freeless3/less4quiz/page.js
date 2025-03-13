"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
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
          Next Sentence
        </button>
      </div>
    </div>
  );
};

const SentenceQuizPage4 = () => {
  const [lesson, setLesson] = useState(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]); // For current sentence options
  const [shuffledSentences, setShuffledSentences] = useState([]); // For shuffled sentences
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

  // Fetch lesson data and shuffle sentences
  useEffect(() => {
    if (title) {
      if (cache.current[title]) {
        const cachedLesson = cache.current[title];
        setLesson(cachedLesson);
        const shuffled = shuffleArray(cachedLesson.themes[0].sentences);
        setShuffledSentences(shuffled); // Store shuffled sentences
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
              const shuffled = shuffleArray(fetchedLesson.themes[0].sentences);
              setShuffledSentences(shuffled); // Store shuffled sentences
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

  const generateOptions = (sentenceIndex) => {
    if (!lesson || !lesson.themes || !lesson.themes[0].sentences) return;

    const correctOption = shuffledSentences[sentenceIndex]?.armenian;
    if (!correctOption) {
      console.error(
        `No Armenian translation found for sentence at index ${sentenceIndex}`
      );
      return;
    }

    const allSentences = lesson.themes[0].sentences;

    let options = [correctOption];
    while (options.length < 3) {
      const randomSentence =
        allSentences[Math.floor(Math.random() * allSentences.length)]?.armenian;
      if (randomSentence && !options.includes(randomSentence)) {
        options.push(randomSentence);
      }
    }

    setCurrentOptions(shuffleArray(options)); // Shuffle options for randomness
  };

  const checkAnswer = () => {
    const correctAnswer = shuffledSentences[currentSentenceIndex].armenian;
    const isAnswerCorrect = selectedAnswer === correctAnswer;

    setIsCorrect(isAnswerCorrect); // Set correctness based on selected answer
    setModalImage(isAnswerCorrect ? correctImage : incorrectImage); // Set the correct feedback image
    setIsChecked(true); // Mark as checked
    setModalVisible(true); // Show modal
  };

  const nextSentence = () => {
    if (currentSentenceIndex < shuffledSentences.length - 1) {
      const newIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(newIndex);
      generateOptions(newIndex); // Generate options for the next sentence
      setIsCorrect(null);
      setSelectedAnswer(null);
      setIsChecked(false);
    } else {
      router.push(`/freeless/free3/freeless3/less5quiz?title=${title}`);
    }
    setModalVisible(false);
  };

  // Ensure that generateOptions is only called after lesson data is loaded and shuffled sentences are available
  useEffect(() => {
    if (shuffledSentences.length > 0 && currentSentenceIndex === 0) {
      generateOptions(currentSentenceIndex); // Ensure options are generated for the first sentence
    }
  }, [shuffledSentences, currentSentenceIndex]); // Dependency on shuffledSentences and currentSentenceIndex

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

  const currentSentence = shuffledSentences[currentSentenceIndex] || {};

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="mb-6 text-center">
        <p className="text-purple-800 text-xl md:text-2xl mb-8 font-semibold">
          find a correct
        </p>

        <p className="text-lg text-white bg-gray-800 rounded shadow-md px-3 py-2 font-semibold">
          {currentSentence.english}
        </p>
      </div>

      <div className="flex flex-col gap-4 items-center md:w-2/3 w-3/4">
        {currentOptions.length > 0 ? (
          currentOptions.map((option, index) => (
            <button
              key={`${option}-${index}`} // Ensure key is unique
              className={`py-2 px-6 rounded-lg text-md w-full font-semibold ${
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
        onNext={nextSentence} // Pass nextSentence to the modal
      />
    </div>
  );
};

export default function Qv4() {
  return (
    <Suspense>
      <SentenceQuizPage4 />
    </Suspense>
  );
}
