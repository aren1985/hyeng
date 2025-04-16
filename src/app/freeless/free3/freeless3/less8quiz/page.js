"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVolumeUp, FaMicrophoneAlt } from "react-icons/fa"; // React listen icon and mic icon
import Image from "next/image"; // For modal images
import teachik from "../../../../images/Teachik.png";

// Import images for modal feedback
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
          }/documents3/lessdocuments3/${encodeURIComponent(title)}`
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
      speech.lang = "en-GB"; // Adjust language to British English
      speech.rate = 1; // Adjust speed for clarity

      // Get available voices and select a specific one if needed
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

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB"; // Set language to British English for recognition
    recognition.interimResults = true; // Get results as user speaks

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
      router.push(`/freeless/free3/freelessik?title=${title}`);
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
        Speak the Sentence
      </h1>

      <button
        onClick={handleAudioPlay}
        className="px-4 py-2 bg-orange-500 text-white text-lg rounded mb-4 flex items-center font-semibold"
        disabled={isListening}
      >
        <FaVolumeUp className="mr-2 text-2xl" />
        {isListening ? "Listening..." : "Listen the Sentence"}
      </button>
      <div className="mb-2 flex flex-col items-center">
        <div>
          <Image src={teachik} alt="tete" width={100} height={100} />
        </div>
        <p className="text-lg text-white mt-2"> ~~You said~~</p>
        <div className="mb-4 p-2 bg-gray-400 w-48">
          <p className="text-lg p-2 text-green-700 font-semibold">
            <em> {userSpokenText}</em>
          </p>
        </div>
      </div>

      <button
        onClick={startListening}
        className="px-4 py-2 bg-blue-600 text-white text-lg rounded mb-4 flex items-center font-semibold"
        disabled={isListening}
      >
        <FaMicrophoneAlt className="mr-2 text-2xl" />
        {isListening ? "Listening..." : "Speak the Sentence"}
      </button>

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
