"use client";

import React, { useEffect, useState, useRef } from "react";
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
          } text-white border-2 w-full border-white py-2 px-6 rounded mt-4`}
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

const ArmenianQuiz = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const router = useRouter();
  const cache = useRef({});

  // Fetch images
  useEffect(() => {
    if (selectedCategory) {
      if (cache.current[selectedCategory]) {
        setImages(cache.current[selectedCategory]);
        generateAnswerOptions(cache.current[selectedCategory], 0);
      } else {
        axios
          .get(`http://localhost:3033/images/allik/${selectedCategory}`)
          .then((response) => {
            const data = response.data;
            setImages(data);
            cache.current[selectedCategory] = data;
            if (data.length > 0) generateAnswerOptions(data, 0);
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
          });
      }
    }
  }, [selectedCategory]);

  const generateAnswerOptions = (images, index) => {
    const correctEnglishName = images[index]?.name;
    const incorrectNames = images
      .filter((_, i) => i !== index)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((img) => img.name);

    const options = [correctEnglishName, ...incorrectNames].sort(
      () => Math.random() - 0.5
    );
    setAnswerOptions(options);
  };

  const checkAnswer = (selectedName) => {
    const correctAnswer = images[currentIndex]?.name;
    if (selectedName === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setModalVisible(true);
  };

  const nextWord = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateAnswerOptions(images, nextIndex);
      setModalVisible(false);
      setIsCorrect(null);
    } else {
      router.push(`/basic/writename?page=write&category=${selectedCategory}`);
    }
  };

  if (images.length === 0) return <p>Loading images...</p>;

  const currentArmenianName = images[currentIndex]?.armenianName;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl text-purple-800 font-bold mb-6">
        Select the correct English name
      </h1>
      <p className="text-xl text-green-800 shadow-md mb-6 p-2 font-semibold">
        {currentArmenianName || "Armenian name not available"}
      </p>

      <div className="flex flex-col items-center gap-4 mb-6">
        {answerOptions.map((name, index) => (
          <button
            key={index}
            onClick={() => checkAnswer(name)}
            className="bg-blue-500 text-white py-2 w-full font-bold px-6 rounded hover:bg-blue-600 transition duration-200"
          >
            {name}
          </button>
        ))}
      </div>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextWord}
      />
    </div>
  );
};

export default ArmenianQuiz;
