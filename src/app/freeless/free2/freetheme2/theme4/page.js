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
          Next Sentence
        </button>
      </div>
    </div>
  );
};

const Theme5Page = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordPool, setWordPool] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes2/themik2/${title}`)
        .then((response) => {
          if (response.data && response.data.sentences) {
            const shuffledSentences = response.data.sentences.sort(
              () => Math.random() - 0.5
            );
            setSentences(shuffledSentences);
            initializePuzzle(shuffledSentences, 0); // Initialize puzzle with the first sentence
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching sentences:", err);
          setLoading(false);
        });
    }
  }, [title]);

  const initializePuzzle = (sentences, sentenceIndex) => {
    const currentSentence = sentences[sentenceIndex];
    const correctWords = currentSentence.englishsentence.split(" ");

    // Add distractor words
    const distractorWords = getDistractorWords(
      sentences,
      sentenceIndex,
      correctWords.length
    );

    // Combine correct words and distractors, ensuring uniqueness
    const wordPoolSet = new Set([...correctWords, ...distractorWords]);

    // Shuffle the combined word pool (correct words + distractors)
    const shuffledWordPool = Array.from(wordPoolSet).sort(
      () => Math.random() - 0.5
    );

    setWordPool(shuffledWordPool);
    setSelectedWords([]);
  };

  const getDistractorWords = (sentences, currentIndex, correctWordsCount) => {
    const distractors = [];
    const correctWords = sentences[currentIndex].englishsentence.split(" ");

    sentences.forEach((sentence, index) => {
      if (index !== currentIndex) {
        // Add words from other sentences, but not the correct words
        distractors.push(...sentence.englishsentence.split(" "));
      }
    });

    // Filter out the correct words and limit distractors count
    return [
      ...new Set(distractors.filter((word) => !correctWords.includes(word))),
    ].slice(0, correctWordsCount); // Limit the distractor words count
  };

  const handleWordClick = (word) => {
    if (wordPool.includes(word)) {
      setSelectedWords([...selectedWords, word]);
      setWordPool(wordPool.filter((w) => w !== word));
    }
  };

  const handleWordRemove = (word) => {
    setWordPool([...wordPool, word]);
    setSelectedWords(selectedWords.filter((w) => w !== word));
  };

  const checkAnswer = () => {
    const correctAnswer = sentences[currentSentenceIndex].englishsentence
      .split(" ")
      .join(" ");
    const userAnswer = selectedWords.join(" ");

    if (
      userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    ) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setShowModal(true);
  };

  const nextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      initializePuzzle(sentences, nextIndex); // Initialize puzzle for the next sentence
      setIsCorrect(null);
      setShowModal(false);
    } else {
      router.push(`/freeless/free2/freetheme2/theme5?title=${title}`);
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
        <p className="mt-4 text-gray-700 text-lg font-medium">
          Loading theme...
        </p>
      </div>
    );
  if (!sentences || sentences.length === 0)
    return <p className="text-center text-lg">No sentences available.</p>;

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold text-purple-800 mb-6">
        Rearrange the Sentence
      </h1>
      <p className="text-md md:text-lg rounded mb-4 py-2 px-3 bg-gray-800 shadow-md font-semibold text-white">
        {currentSentence.armeniansentence}
      </p>

      <div className="flex flex-col items-center w-full rounded-lg ">
        <p className="text-md mb-4 text-gray-800">
          Select the correct English words
        </p>

        <div className="flex flex-wrap gap-3 mb-6 border-b-2 pb-3">
          {wordPool.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className="px-3 py-2 text-md font-semibold bg-blue-700 text-white rounded hover:bg-blue-500 transition"
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {selectedWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordRemove(word)}
              className="px-3 py-2 text-md font-semibold  bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              {word}
            </button>
          ))}
        </div>

        <button
          onClick={checkAnswer}
          className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        >
          Check Answer
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

export default function Th4p() {
  return (
    <Suspense>
      <Theme5Page />
    </Suspense>
  );
}
