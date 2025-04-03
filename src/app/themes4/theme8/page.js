"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa"; // Added microphone icon
import Image from "next/image";

import teachik from "../../images/Teachik.png";

import correctImage from "../../images/newlike.webp";
import incorrectImage from "../../images/dislike.webp";
const normalizeText = (text) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "");
};

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

const Theme8Page = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [spokenText, setSpokenText] = useState("");
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes4/themik4/${title}`)
        .then((response) => {
          if (response.data?.sentences) {
            const shuffledSentences = response.data.sentences.sort(
              () => Math.random() - 0.5
            );
            setSentences(shuffledSentences);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching sentences:", err);
          setLoading(false);
        });
    }
  }, [title]);

  const playSentence = () => {
    const sentence = sentences[currentSentenceIndex]?.englishsentence;
    if (!sentence) return;

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-GB"; // Set language to British English (or use "en-US" for American English)
    utterance.rate = 0.9; // Adjust speech rate for clarity

    // Get available voices and select a specific one if desired
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Samantha") // Example: Specific voice selection
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setSpokenText(spoken);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const checkAnswer = () => {
    const correctAnswer = sentences[currentSentenceIndex]?.englishsentence;
    const normalizedSpokenText = normalizeText(spokenText);
    const normalizedCorrectAnswer = normalizeText(correctAnswer);

    if (normalizedSpokenText === normalizedCorrectAnswer) {
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
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setSpokenText("");
      setIsCorrect(null);
      setShowModal(false);
    } else {
      router.push("/levels/btwolevel");
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
    return <p>No sentences available.</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold text-purple-800 mb-6">
        Listen and Speak
      </h1>

      <div className="text-center mb-3">
        <button
          onClick={playSentence}
          className="bg-orange-600 text-white py-2 px-4 text-lg gap-2 rounded shadow-lg mb-4 flex justify-center items-center"
        >
          <FaVolumeUp className="text-2xl" />
          <p>listen</p>
        </button>
      </div>

      <div className="mb-2 flex flex-col items-center">
        <div>
          <Image src={teachik} alt="tete" width={100} height={100} />
        </div>
        <p className="text-lg text-white mt-2"> ~~You said~~</p>
        <div className="mb-4 p-2 bg-gray-300 w-48">
          <p className="text-lg p-2 text-green-900 font-semibold">
            <em> {spokenText}</em>
          </p>
        </div>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={startVoiceRecognition}
          className="bg-blue-600 text-white py-2 px-4 text-lg gap-2 rounded shadow-lg flex justify-center items-center"
        >
          <FaMicrophone className="text-2xl" />
          <p>speak</p>
        </button>
      </div>

      <div className="text-center mb-6 w-full">
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

export default function Th8p() {
  return (
    <Suspense>
      <Theme8Page />
    </Suspense>
  );
}
