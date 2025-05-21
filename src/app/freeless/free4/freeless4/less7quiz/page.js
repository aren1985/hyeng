"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVolumeUp } from "react-icons/fa"; // React listen icon
import Image from "next/image"; // For modal images

// Import images from the Images folder
import correctImage from "../../../../images/newlike.webp";
import incorrectImage from "../../../../images/dislike.webp";
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
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/documents4/lessdocuments4/${encodeURIComponent(title)}`
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

    const wordPool = [...correctWords, ...distractorWords].sort(
      () => Math.random() - 0.5
    );

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
    const index = wordPool.indexOf(word);
    if (index !== -1) {
      const newPool = [...wordPool];
      newPool.splice(index, 1); // հեռացնում ենք միայն առաջին հանդիպումը
      setWordPool(newPool);
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleWordRemove = (word) => {
    const index = selectedWords.indexOf(word);
    if (index !== -1) {
      const newSelected = [...selectedWords];
      newSelected.splice(index, 1);

      setSelectedWords(newSelected);
      setWordPool([...wordPool, word]); // կարող ես այստեղ էլ սարքել `splice`-ով, եթե կարգը կարևոր է
    }
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
      router.push(`/freeless/free4/freeless4/less8quiz?title=${title}`);
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
      speech.lang = "en-GB"; // You can change this to "en-US" or any language/voice you prefer
      speech.rate = 0.9; // Adjust speed for clarity

      // Get available voices and select a specific one if you want
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.name.includes("Samantha") // Change this to your preferred voice
      );

      if (preferredVoice) {
        speech.voice = preferredVoice;
      }

      window.speechSynthesis.speak(speech);

      setIsListening(true);
      speech.onend = () => setIsListening(false);
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

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-4">
        Rearrange the Sentence
      </h1>
      <button
        onClick={handleAudioPlay}
        className="px-4 py-2 bg-orange-600 text-white rounded mb-4 flex items-center font-semibold"
        disabled={isListening}
      >
        <FaVolumeUp className="mr-2" />
        {isListening ? "Listening..." : "Listen "}
      </button>

      <div className="flex flex-col items-center w-full">
        <p className="text-xl mb-4">Select the correct English words</p>
        <div className="flex flex-wrap gap-2 mb-4 border-b-2 pb-3">
          {wordPool.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className="px-4 py-2 bg-blue-800 text-white rounded font-semibold"
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
              className="px-4 py-2 bg-gray-300  text-black font-semibold rounded"
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

export default function Ltp() {
  return (
    <Suspense>
      <Less7QuizPage />
    </Suspense>
  );
}
