/*"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa"; // Added microphone icon
import Image from "next/image";

import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes/themik/${title}`)
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
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
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
      router.push("/themes/allthemes");
    }
  };

  if (loading) return <p>Loading sentences...</p>;
  if (!sentences || sentences.length === 0)
    return <p>No sentences available.</p>;

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold text-purple-800 mb-6">
        Listen and Speak
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={playSentence}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg mb-4"
        >
          <FaVolumeUp className="text-3xl" />
        </button>
        <p className="text-lg text-gray-600">
          Listen to the sentence and repeat it aloud.
        </p>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={startVoiceRecognition}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg"
        >
          <FaMicrophone className="text-3xl" />
        </button>
        <p className="text-lg text-gray-600 mt-2">Click to start speaking</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-lg text-gray-800">
          You said: <em>{spokenText}</em>
        </p>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={checkAnswer}
          className="bg-purple-500 text-white p-3 rounded-full shadow-lg"
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

export default Theme8Page;*/
