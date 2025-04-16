"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaVolumeUp } from "react-icons/fa";

// Import feedback images
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

const Theme7Page = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordPool, setWordPool] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes3/themik3/${title}`)
        .then((response) => {
          const fetchedSentences = response.data.sentences || [];
          const randomizedSentences = shuffleArray(fetchedSentences);
          setSentences(randomizedSentences);
          initializePuzzle(randomizedSentences, 0);
        })
        .catch((err) => console.error("Error fetching sentences:", err));
    }
  }, [title]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializePuzzle = (sentences, index) => {
    const correctWords = sentences[index]?.englishsentence.split(" ") || [];
    const distractorWords = generateDistractors(sentences, correctWords);
    const allWords = [...new Set([...correctWords, ...distractorWords])];
    setWordPool(shuffleArray(allWords));
    setSelectedWords([]);
  };

  const generateDistractors = (sentences, correctWords) => {
    const allWords = sentences.flatMap((sentence) =>
      sentence.englishsentence.split(" ")
    );
    return allWords
      .filter((word) => !correctWords.includes(word))
      .slice(0, correctWords.length);
  };

  const playSentence = () => {
    const sentence = sentences[currentSentenceIndex]?.englishsentence || "";
    if (!sentence) return;

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-GB"; // Set language to British English (or change to "en-US" for American)
    utterance.rate = 0.9; // Adjust speed for clarity

    // Get available voices and select a specific one if needed
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Samantha") // Replace with your preferred voice
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const handleWordClick = (word) => {
    setSelectedWords([...selectedWords, word]);
    setWordPool(wordPool.filter((w) => w !== word));
  };

  const handleWordRemove = (word) => {
    setWordPool([...wordPool, word]);
    setSelectedWords(selectedWords.filter((w) => w !== word));
  };

  const checkAnswer = () => {
    const correctSentence = sentences[currentSentenceIndex]?.englishsentence;
    const userSentence = selectedWords.join(" ");
    if (
      userSentence.trim().toLowerCase() === correctSentence.trim().toLowerCase()
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
      initializePuzzle(sentences, nextIndex);
      setShowModal(false);
    } else {
      router.push(`/freeless/free3/freetheme3/theme8?title=${title}`);
    }
  };

  if (!sentences.length) {
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
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-purple-800">
        Rearrange the Sentence
      </h1>
      <button
        onClick={playSentence}
        className="flex items-center gap-2 bg-orange-600 text-white p-3 rounded-full font-semibold shadow mb-4 hover:bg-blue-600 transition"
      >
        <FaVolumeUp className="text-xl" />
        Listen to the Sentence
      </button>
      <div className="mb-6">
        <p className="text-md mb-4 text-gray-800 text-center">
          Select the correct English words
        </p>

        <div className="flex flex-wrap gap-3 mb-4 font-semibold">
          {wordPool.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className="px-3 py-2 bg-gray-200 rounded shadow hover:bg-gray-300"
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 border-t-2 pt-4 font-semibold">
          {selectedWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordRemove(word)}
              className="px-3 py-2 bg-green-200 rounded shadow hover:bg-green-300"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>
      <Modal
        visible={showModal}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextSentence}
      />
    </div>
  );
};

export default function Th7p() {
  return (
    <Suspense>
      <Theme7Page />
    </Suspense>
  );
}
