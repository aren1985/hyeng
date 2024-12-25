"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";
import Image from "next/image";

// Feedback Images
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

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
          } text-white border-2 w-full border-white py-2 px-6 rounded mt-4`}
        >
          Next Image
        </button>
      </div>
    </div>
  );
};

const WriteName = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const router = useRouter();
  const cache = useRef({});

  useEffect(() => {
    if (selectedCategory) {
      if (cache.current[selectedCategory]) {
        setImages(cache.current[selectedCategory]);
        speakImageName(cache.current[selectedCategory][0].name);
      } else {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/images/allik/${selectedCategory}`
          )
          .then((response) => {
            const data = response.data;
            setImages(data);
            cache.current[selectedCategory] = data;
            if (data.length > 0) speakImageName(data[0].name);
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
          });
      }
    }
  }, [selectedCategory]);

  const speakImageName = (name) => {
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = "en-US"; // Explicitly set the language to English (US)
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    const correctName = images[currentIndex]?.name;
    if (userInput.trim().toLowerCase() === correctName?.toLowerCase()) {
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
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setUserInput("");
      speakImageName(images[nextIndex].name);
      setModalVisible(false);
      setIsCorrect(null);
    } else {
      router.push(
        `/basic/speachwrite?page=speachwrite&category=${selectedCategory}`
      );
    }
  };

  if (images.length === 0) return <p>Loading images...</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-6">
        Listen and write
      </h1>

      <div className="mb-4">
        <img
          src={`data:image/jpeg;base64,${images[currentIndex]?.image}`}
          alt="Current displayed image"
          className="rounded w-64 h-36 md:h-44 object-cover mb-4"
        />
      </div>

      <button
        onClick={() => speakImageName(images[currentIndex]?.name)}
        className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600 transition duration-200 flex items-center mb-6"
      >
        <FaVolumeUp className="mr-2" />
        Hear Name Again
      </button>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border p-2 rounded w-full max-w-xs mb-4"
        placeholder="Type the name here"
      />

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

export default function WrtNm() {
  return (
    <Suspense>
      <WriteName />
    </Suspense>
  );
}
