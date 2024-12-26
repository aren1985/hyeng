"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
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
          isCorrect ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <Image src={imageSrc} alt="Feedback" width={200} height={200} />
        <button
          onClick={onNext}
          className={`${
            isCorrect ? "bg-green-500" : "bg-red-500"
          } text-white py-2 px-6 rounded w-full mt-4 border-2 border-white`}
        >
          Next Image
        </button>
      </div>
    </div>
  );
};

const NextQuiz = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const router = useRouter();
  const cache = useRef({});

  // Fetch images based on the selected category
  useEffect(() => {
    if (selectedCategory) {
      if (cache.current[selectedCategory]) {
        setImages(cache.current[selectedCategory]);
      } else {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/images/allik/${selectedCategory}`
          )
          .then((response) => {
            const data = response.data;
            setImages(data);
            cache.current[selectedCategory] = data;
          })
          .catch((err) => {
            console.error("Error fetching images:", err);
          });
      }
    }
  }, [selectedCategory]);

  const checkAnswer = () => {
    const correctAnswer = images[currentIndex]?.name;
    if (userChoice === correctAnswer) {
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
      setSelectedOptionIndex(null); // Reset selected option after moving to next image
    } else {
      router.push(
        `/basic/hayerengtir?page=speachwrite&category=${selectedCategory}`
      );
    }
  };

  if (images.length === 0) return <p>Loading...</p>;

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl  text-purple-800 font-bold mb-6">
        Choose the Correct Name
      </h1>
      <div className="mb-6">
        <img
          src={`data:image/jpeg;base64,${currentImage.image}`}
          alt="Current"
          className="w-64 h-36 md:h-44 object-cover mb-4"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => {
              setUserChoice(img.name);
              setSelectedOptionIndex(index);
            }}
            className={`bg-blue-500 text-white py-2 w-64 font-bold px-6 rounded hover:bg-blue-600 transition duration-200 ${
              selectedOptionIndex === index ? "bg-gray-500" : ""
            }`}
          >
            {img.name}
          </button>
        ))}
      </div>

      {/* Check Answer Button */}
      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextImage}
      />
    </div>
  );
};

export default function Nqz() {
  return (
    <Suspense>
      <NextQuiz />
    </Suspense>
  );
}
