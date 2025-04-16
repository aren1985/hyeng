"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaMicrophone, FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";

import teachik from "../../images/Teachik.png";

// Feedback Images
import correctImage from "../../images/newlike.webp";
import incorrectImage from "../../images/dislike.webp";

let SpeechRecognition;
if (typeof window !== "undefined") {
  // Initialize SpeechRecognition only in the browser
  SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
}

const SpeechToTextPage = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spokenWord, setSpokenWord] = useState(""); // Store the spoken word
  const [isCorrect, setIsCorrect] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const router = useRouter();
  const recognition = useRef(null); // Speech recognition instance
  const [recognitionActive, setRecognitionActive] = useState(false); // Track recognition state

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/images/allik/${selectedCategory}`
        )
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });

      if (SpeechRecognition) {
        // Initialize Speech Recognition in the browser
        recognition.current = new SpeechRecognition();
        recognition.current.lang = "en-GB"; // Set language to British English (change as needed)
        recognition.current.interimResults = false;
        recognition.current.maxAlternatives = 1;
      }
    }

    // Cleanup on unmount
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [selectedCategory]);

  const startSpeechRecognition = () => {
    if (!recognitionActive && recognition.current) {
      recognition.current.start();
      setRecognitionActive(true); // Set recognition state to active
    }
  };

  const handleSpeechResult = (event) => {
    const spokenWord = event.results[0][0].transcript.toLowerCase();
    setSpokenWord(spokenWord); // Update the spoken word
  };

  const checkAnswer = () => {
    const correctName = images[currentIndex]?.name.toLowerCase();

    if (spokenWord === correctName) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setModalVisible(true);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsCorrect(null);
      setModalVisible(false);
      setSpokenWord(""); // Reset spoken word for next image
    } else {
      router.push("/basic/allparts");
    }
  };

  useEffect(() => {
    if (recognition.current) {
      recognition.current.addEventListener("result", handleSpeechResult);
      recognition.current.addEventListener("end", () =>
        setRecognitionActive(false)
      ); // Reset active state when recognition ends
    }

    return () => {
      if (recognition.current) {
        recognition.current.removeEventListener("result", handleSpeechResult);
      }
    };
  }, [currentIndex]);

  if (images.length === 0)
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

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Listen and speak
      </h1>

      <div className="mb-4">
        <img
          src={`data:image/jpeg;base64,${currentImage?.image}`}
          alt="Current displayed image"
          className="rounded shadow-md w-64 h-36 md:h-44"
        />
      </div>

      <button
        onClick={() => {
          const utterance = new SpeechSynthesisUtterance(currentImage.name);
          utterance.lang = "en-GB"; // Set language to British English (change as needed)
          utterance.rate = 1; // Adjust speech rate to make it slower

          // Get available voices and select a specific one
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (voice) => voice.lang === "en-GB" && voice.name.includes("Daniel") // Example voice for en-GB
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          speechSynthesis.speak(utterance);
        }}
        className="bg-orange-600 text-white font-semibold py-2 px-6 rounded hover:bg-yellow-600 transition duration-200 flex items-center mb-6"
      >
        <FaVolumeUp className="mr-2 text-2xl" />
        start listening
      </button>

      <div className="mb-2 flex flex-col items-center">
        <div>
          <Image src={teachik} alt="tete" width={100} height={100} />
        </div>
        <p className="text-lg text-white mt-2"> ~~You said~~</p>
        <div className="mb-4 p-2 bg-gray-300 w-48 flex items-center justify-center">
          <p className="text-lg p-2 text-green-900 font-semibold text-center">
            <em> {spokenWord}</em>
          </p>
        </div>
      </div>

      <button
        onClick={startSpeechRecognition}
        className="bg-blue-700 text-white font-semibold py-2 px-6 rounded hover:bg-green-600 transition duration-200 flex items-center mb-6"
      >
        <FaMicrophone className="mr-2 text-2xl" />
        Start Speaking
      </button>

      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        onNext={nextImage}
        isCorrect={isCorrect}
      />
    </div>
  );
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
          } text-white py-2 px-6 border-2 w-full border-white rounded mt-4`}
        >
          Next Image
        </button>
      </div>
    </div>
  );
};

export default function Spch() {
  return (
    <Suspense>
      <SpeechToTextPage />
    </Suspense>
  );
}
