"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa"; // Add both icons
import correctImage from "../../images/newlike.webp";
import incorrectImage from "../../images/dislike.webp";
import Image from "next/image";

const Words5Page = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spokenWord, setSpokenWord] = useState(""); // Stores the spoken word
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/words/wordik/${title}`)
        .then((response) => {
          setWords(response.data.words || []);
        })
        .catch((err) => {
          setError("Failed to load words. Please try again.");
        });
    }
  }, [title]);

  const speakWord = () => {
    const currentWord = words[currentWordIndex]?.english;
    if (!currentWord) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";
    utterance.rate = 0.8;

    // Get available voices and select a preferred one (e.g., "Samantha" for iOS)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      voice.name.includes("Samantha")
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    const correctAnswer = words[currentWordIndex]?.english.toLowerCase();
    if (spokenWord.trim().toLowerCase() === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setModalVisible(true);
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSpokenWord(""); // Reset spoken word for next round
      setIsCorrect(null);
    } else {
      router.push("/words/allwords");
    }

    setModalVisible(false);
  };

  const handleSpeech = (event) => {
    const spoken = event.results[0][0].transcript;
    setSpokenWord(spoken);
  };

  const startListening = () => {
    const recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognition) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }

    const recognitionInstance = new recognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.start();
    recognitionInstance.onresult = handleSpeech;
  };

  if (error) return <p className="text-red-600">{error}</p>;

  const currentWord = words[currentWordIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-3xl font-bold mb-6 text-purple-800">
        Listen and Speak
      </h1>

      <div className="mb-6 text-center">
        <button
          onClick={speakWord}
          className="text-white bg-orange-500 mt-2 shadow-md py-2 px-6 flex items-center text-lg space-x-2 font-semibold rounded"
          aria-label={`Listen to the word "${currentWord?.english}"`}
        >
          <FaVolumeUp className="text-2xl " />
          <span>listen</span>
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium bg-gray-200 p-2">
          You said- {spokenWord}
        </p>
      </div>

      <button
        onClick={startListening}
        className="bg-green-500 text-white py-2 px-6 rounded mt-6 text-lg font-semibold flex items-center space-x-2"
      >
        <FaMicrophone className="text-2xl " />
        <span>Start Speaking</span>
      </button>

      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>

      {modalVisible && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
        >
          <div
            className={`p-6 rounded-lg flex flex-col items-center ${
              isCorrect ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <Image src={modalImage} alt="Feedback" width={200} height={200} />
            <button
              onClick={nextWord}
              className={`${
                isCorrect ? "bg-green-600" : "bg-red-600"
              } text-white  py-2 rounded mt-4 text-lg w-full border-2 border-white`}
            >
              Next Word
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function W5Pg() {
  return (
    <Suspense>
      <Words5Page />
    </Suspense>
  );
}
