/*"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaMicrophone, FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";

// Feedback Images
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

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

      // Initialize Speech Recognition
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.interimResults = false;
      recognition.current.maxAlternatives = 1;
    }
  }, [selectedCategory]);

  const startSpeechRecognition = () => {
    if (!recognitionActive) {
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

  if (images.length === 0) return <p>Loading...</p>;

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
        onClick={() =>
          speechSynthesis.speak(new SpeechSynthesisUtterance(currentImage.name))
        }
        className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600 transition duration-200 flex items-center mb-6"
      >
        <FaVolumeUp className="mr-2" />
        Hear Name Again
      </button>

      
      <button
        onClick={startSpeechRecognition}
        className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition duration-200 flex items-center mb-6"
      >
        <FaMicrophone className="mr-2" />
        Start Speaking
      </button>

      
      <div className="mb-4">
        <p className="text-xl font-semibold">You said- {spokenWord}</p>
      </div>

      
      <button
        onClick={checkAnswer}
        className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200"
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

export default SpeechToTextPage;*/
