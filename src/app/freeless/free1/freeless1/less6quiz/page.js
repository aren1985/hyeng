"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
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
          isCorrect ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <Image src={imageSrc} alt="Feedback" width={200} height={200} />

        <button
          onClick={onNext}
          className={`${
            imageSrc === incorrectImage ? "bg-red-500" : "bg-green-500"
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }} // Match width to image
        >
          Next Sentence
        </button>
      </div>
    </div>
  );
};

const Less6QuizPage = () => {
  const [lesson, setLesson] = useState(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(null); // Start with null
  const [wordPool, setWordPool] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usedIndexes, setUsedIndexes] = useState([]); // Track used sentence indices
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/documents/lessdocuments/${encodeURIComponent(title)}`
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setLesson(response.data[0]);
            initializePuzzle(response.data[0]); // Initialize with a random sentence
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching lesson:", err);
          setLoading(false);
        });
    }
  }, [title]);

  const initializePuzzle = (lessonData) => {
    const sentences = lessonData.themes[0].sentences;

    // If all sentences are used, reset the used indexes
    if (usedIndexes.length === sentences.length) {
      setUsedIndexes([]); // Reset if all sentences have been used
    }

    // Randomly select an unused sentence index
    let randomSentenceIndex;
    do {
      randomSentenceIndex = Math.floor(Math.random() * sentences.length);
    } while (usedIndexes.includes(randomSentenceIndex)); // Avoid used indexes

    const currentSentence = sentences[randomSentenceIndex];
    const correctWords = currentSentence.english.trim().split(" "); // Allow duplicates

    // Collect distractor words
    const distractorWords = getDistractorWords(lessonData, randomSentenceIndex);

    // Combine and shuffle (don't use Set to allow duplicates)
    const wordPool = [...correctWords, ...distractorWords].sort(
      () => Math.random() - 0.5
    );

    setWordPool(wordPool);
    setSelectedWords([]);
    setCurrentSentenceIndex(randomSentenceIndex);

    // Mark this sentence index as used
    setUsedIndexes([...usedIndexes, randomSentenceIndex]);
  };

  const getDistractorWords = (lessonData, currentIndex) => {
    const sentences = lessonData.themes[0].sentences;
    const currentSentenceWords = new Set(
      sentences[currentIndex].english.trim().toLowerCase().split(" ")
    );

    let distractors = [];

    sentences.forEach((sentence, index) => {
      if (index !== currentIndex) {
        sentence.english
          .trim()
          .split(" ")
          .forEach((word) => {
            // Միայն այն բառերը, որոնք **չկան** ընթացիկ նախադասությունում
            if (!currentSentenceWords.has(word.toLowerCase())) {
              distractors.push(word);
            }
          });
      }
    });

    // Հանենք կրկնություններ և սահմանափակում ենք մինչև 3 բառ
    return [...new Set(distractors)].slice(0, 3);
  };

  const handleWordClick = (word) => {
    setSelectedWords((prev) => [...prev, word]);
    setWordPool((prev) => {
      const index = prev.indexOf(word);
      if (index !== -1) {
        const updated = [...prev];
        updated.splice(index, 1); // Remove only one instance
        return updated;
      }
      return prev;
    });
  };

  const handleWordRemove = (word) => {
    setWordPool((prev) => [...prev, word]); // Add back to pool
    setSelectedWords((prev) => {
      const index = prev.indexOf(word);
      if (index !== -1) {
        const updated = [...prev];
        updated.splice(index, 1); // Remove only one instance
        return updated;
      }
      return prev;
    });
  };

  const checkAnswer = () => {
    const correctAnswer = lesson.themes[0].sentences[
      currentSentenceIndex
    ].english
      .split(" ")
      .join(" ");
    const userAnswer = selectedWords.join(" ");

    if (
      userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    ) {
      setIsCorrect(true);
      setModalImage(correctImage); // Set correct feedback image
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage); // Set incorrect feedback image
    }
    setShowModal(true);
  };

  const nextSentence = () => {
    const sentences = lesson.themes[0].sentences;

    // If there are still unused sentences, select a new random sentence
    if (usedIndexes.length < sentences.length) {
      initializePuzzle(lesson);
      setIsCorrect(null);
      setShowModal(false);
    } else {
      // If all sentences have been used, redirect or restart the quiz
      router.push(`/freeless/free1/freeless1/less7quiz?title=${title}`);
    }
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
  if (!lesson) return <p>No lesson found.</p>;

  const currentSentence = lesson.themes[0].sentences[currentSentenceIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-4">
        Rearrange the Sentence
      </h1>
      <p className="text-md text-white bg-gray-800 font-semibold py-2 px-3 rounded shadow-md  mb-4">
        {currentSentence.armenian}
      </p>

      <div className="flex flex-col items-center w-full">
        <p className="text-xl mb-4">Select the correct English words</p>

        <div className="flex flex-wrap gap-2 mb-4 border-b-2 pb-3">
          {wordPool.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className="px-4 py-2 font-semibold bg-blue-700 text-white rounded"
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 ">
          {selectedWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordRemove(word)}
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded"
            >
              {word}
            </button>
          ))}
        </div>

        <button
          onClick={checkAnswer}
          className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        >
          check Answer
        </button>
      </div>

      <Modal
        visible={showModal}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextSentence}
      />
    </div>
  );
};

export default function L6p() {
  return (
    <Suspense>
      <Less6QuizPage />
    </Suspense>
  );
}
