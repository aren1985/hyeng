"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVolumeUp } from "react-icons/fa"; // React listen icon
import Image from "next/image"; // For modal images

// Import images from the Images folder
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

// Reusable Modal component
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
            isCorrect ? "bg-green-500" : "bg-red-500"
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }}
        >
          Next Sentence
        </button>
      </div>
    </div>
  );
};

const Less7QuizPage = () => {
  const [lesson, setLesson] = useState(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordPool, setWordPool] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null); // Modal image state
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [spokenSentences, setSpokenSentences] = useState(new Set()); // Track spoken sentences
  const [answeredSentences, setAnsweredSentences] = useState(new Set()); // Track answered sentences
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(
          `http://localhost:3033/documents/lessdocuments/${encodeURIComponent(
            title
          )}`
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setLesson(response.data[0]);
            initializePuzzle(response.data[0], 0);
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

  const initializePuzzle = (lessonData, sentenceIndex) => {
    const sentences = lessonData.themes[0].sentences;
    const currentSentence = sentences[sentenceIndex];
    const correctWords = currentSentence.english.split(" ");
    const distractorWords = getDistractorWords(lessonData, sentenceIndex);

    const wordPoolSet = new Set([...correctWords, ...distractorWords]);
    const wordPool = Array.from(wordPoolSet).sort(() => Math.random() - 0.5);

    setWordPool(wordPool);
    setSelectedWords([]);
    setCurrentSentenceIndex(sentenceIndex);
  };

  const getDistractorWords = (lessonData, currentIndex) => {
    const sentences = lessonData.themes[0].sentences;
    let distractors = [];
    sentences.forEach((sentence, index) => {
      if (index !== currentIndex) {
        distractors = [...distractors, ...sentence.english.split(" ")];
      }
    });
    return [...new Set(distractors)].slice(0, 5);
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
      setModalImage(correctImage);
      setShowModal(true);
      setAnsweredSentences(
        new Set([...answeredSentences, currentSentenceIndex])
      );
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
      setShowModal(true);
      setAnsweredSentences(
        new Set([...answeredSentences, currentSentenceIndex])
      );
    }
  };

  const nextSentence = () => {
    // Get all remaining sentences that haven't been spoken or answered yet
    const remainingIndexes = lesson.themes[0].sentences
      .map((_, index) => index)
      .filter(
        (index) => !spokenSentences.has(index) && !answeredSentences.has(index)
      );

    if (remainingIndexes.length === 0) {
      // All sentences have been completed, navigate to the next quiz
      router.push(`/lessons/less8quiz?title=${title}`);
      return;
    }

    // Pick a random sentence from remaining ones
    const nextIndex =
      remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];
    initializePuzzle(lesson, nextIndex);

    // Add the picked sentence to the spoken sentences set
    setSpokenSentences(new Set([...spokenSentences, nextIndex]));
    setIsCorrect(null);
    setShowModal(false);
  };

  const handleAudioPlay = () => {
    if (lesson) {
      const sentences = lesson.themes[0].sentences;
      const currentSentence = sentences[currentSentenceIndex];

      const speech = new SpeechSynthesisUtterance(currentSentence.english);
      speech.lang = "en-US";
      speech.rate = 0.7; // Adjust speed for clarity
      window.speechSynthesis.speak(speech);

      setIsListening(true);
      speech.onend = () => setIsListening(false);
    }
  };

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>No lesson found.</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-4">
        Rearrange the Sentence
      </h1>
      <button
        onClick={handleAudioPlay}
        className="px-4 py-2 bg-orange-500 text-white rounded mb-4 flex items-center"
        disabled={isListening}
      >
        <FaVolumeUp className="mr-2" />
        {isListening ? "Listening..." : "Listen "}
      </button>

      <div className="flex flex-col items-center">
        <p className="text-xl mb-4">Select the correct English words</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {wordPool.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className="px-4 py-2 bg-blue-500 text-white rounded text-[12px] md:text-[15px]"
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordRemove(word)}
              className="px-4 py-2 bg-gray-300 text-[15px] text-gray-800 rounded"
            >
              {word}
            </button>
          ))}
        </div>
        <button
          onClick={checkAnswer}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Check Answer
        </button>
      </div>

      {/* Reusable Modal */}
      <Modal
        visible={showModal}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextSentence}
      />
    </div>
  );
};

export default Less7QuizPage;
