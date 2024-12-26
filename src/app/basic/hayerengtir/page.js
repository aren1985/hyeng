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
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Track selected option index
  const [isAnswered, setIsAnswered] = useState(false); // Track whether an answer has been checked
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
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/images/allik/${selectedCategory}`
          )
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

  const checkAnswer = () => {
    const selectedName = answerOptions[selectedOptionIndex];
    const correctAnswer = images[currentIndex]?.name;
    if (selectedName === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setIsAnswered(true); // Mark as answered
    setModalVisible(true); // Show modal with feedback
  };

  const nextWord = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateAnswerOptions(images, nextIndex);
      setModalVisible(false);
      setIsCorrect(null);
      setSelectedOptionIndex(null); // Reset selected option after moving to next word
      setIsAnswered(false); // Reset the answered status for the next question
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
            onClick={() => setSelectedOptionIndex(index)}
            className={`bg-blue-500 text-white py-2 w-full font-bold px-6 rounded hover:bg-blue-600 transition duration-200 ${
              selectedOptionIndex === index ? "bg-gray-400" : ""
            }`}
            disabled={isAnswered} // Disable options after answer is checked
          >
            {name}
          </button>
        ))}
      </div>

      {/* Check Answer Button */}
      {!isAnswered && (
        <button
          onClick={checkAnswer}
          className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        >
          Check Answer
        </button>
      )}

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextWord}
      />
    </div>
  );
};

export default function ArmQz() {
  return (
    <Suspense>
      <ArmenianQuiz />
    </Suspense>
  );
}
