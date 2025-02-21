"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVolumeUp, FaMicrophoneAlt } from "react-icons/fa"; // React listen icon and mic icon
import Image from "next/image"; // For modal images

// Import images for modal feedback
import correctImage from "../../images/newlike.webp";
import incorrectImage from "../../images/dislike.webp";
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

const Less8QuizPage = () => {
  const [lesson, setLesson] = useState(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userSpokenText, setUserSpokenText] = useState(""); // Store the user’s spoken sentence
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false); // Track if the sentence is being spoken
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

  const handleAudioPlay = () => {
    if (lesson) {
      const currentSentence = lesson.themes[0].sentences[currentSentenceIndex];

      const speech = new SpeechSynthesisUtterance(currentSentence.english);
      speech.lang = "en-US";
      speech.rate = 0.7; // Adjust speed for clarity
      window.speechSynthesis.speak(speech);

      setIsListening(true);
      speech.onend = () => setIsListening(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set language for speech recognition
    recognition.interimResults = true; // Option to get results as user speaks

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the spoken text
      setUserSpokenText(transcript); // Update the spoken text
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const checkAnswer = () => {
    const correctSentence =
      lesson.themes[0].sentences[currentSentenceIndex].english;

    // Normalize both the correct sentence and user spoken text
    const normalize = (text) => {
      return text
        .replace(/[^\w\s]/gi, "")
        .trim()
        .toLowerCase(); // Remove punctuation and trim
    };

    const normalizedUserSpokenText = normalize(userSpokenText);
    const normalizedCorrectSentence = normalize(correctSentence);

    if (normalizedUserSpokenText === normalizedCorrectSentence) {
      setIsCorrect(true);
      setShowModal(true); // Show modal when the answer is correct
    } else {
      setIsCorrect(false);
      setShowModal(true); // Show modal even if the answer is incorrect
    }
  };

  const nextSentence = () => {
    const sentences = lesson.themes[0].sentences;

    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      setUserSpokenText(""); // Clear previous spoken text
      setIsCorrect(null);
      setShowModal(false);
    } else {
      router.push(`/lessons/less?title=${title}`);
    }
  };

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>No lesson found.</p>;

  const currentSentence = lesson.themes[0].sentences[currentSentenceIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-4">
        Speak the Sentence
      </h1>

      <button
        onClick={handleAudioPlay}
        className="px-4 py-2 bg-orange-500 text-white rounded mb-4 flex items-center"
        disabled={isListening}
      >
        <FaVolumeUp className="mr-2" />
        {isListening ? "Listening..." : "Listen to the Sentence"}
      </button>

      <button
        onClick={startListening}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 flex items-center"
        disabled={isListening}
      >
        <FaMicrophoneAlt className="mr-2" />
        {isListening ? "Listening..." : "Speak the Sentence"}
      </button>

      {userSpokenText && (
        <div className="mb-4 bg-white p-2">
          <p className="text-xl">You said-</p>
          <p className="text-lg">{userSpokenText}</p>
        </div>
      )}

      {isCorrect !== null && (
        <div className="mb-4">
          {isCorrect ? (
            <p className="text-green-500">Correct! Well done!</p>
          ) : null}{" "}
        </div>
      )}

      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>

      <Modal
        visible={showModal}
        imageSrc={isCorrect ? correctImage : incorrectImage}
        isCorrect={isCorrect}
        onNext={nextSentence}
      />
    </div>
  );
};

export default function L8p() {
  return (
    <Suspense>
      <Less8QuizPage />
    </Suspense>
  );
}
