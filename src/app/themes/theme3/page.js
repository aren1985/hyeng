/*"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Import images directly from the Images folder
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";

const Modal = ({ visible, imageSrc, onNext, isCorrect }) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div
        className={`p-6 rounded-lg flex flex-col items-center ${
          isCorrect ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <Image src={imageSrc} alt="Feedback" width={200} height={200} />
        <button
          onClick={onNext}
          className={`${
            imageSrc === incorrectImage ? "bg-red-600" : "bg-green-600"
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }} // Match width to image
        >
          Next Sentence
        </button>
      </div>
    </div>
  );
};

const Theme3Page = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      // Fetch sentences based on title
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes/themik/${title}`)
        .then((response) => {
          const fetchedSentences = response.data.sentences || [];
          setSentences(shuffleArray(fetchedSentences)); // Shuffle sentences
        })
        .catch((err) => {
          console.error("Error fetching sentences:", err);
        });
    }
  }, [title]);

  useEffect(() => {
    if (sentences.length > 0) {
      generateOptions();
    }
  }, [sentences, currentSentenceIndex]);

  const generateOptions = () => {
    if (!sentences || sentences.length === 0) return;

    const correctOption =
      sentences[currentSentenceIndex]?.englishsentence || "";
    let allOptions = [correctOption];

    // Generate random incorrect options
    while (allOptions.length < 4) {
      const randomOption =
        sentences[Math.floor(Math.random() * sentences.length)]
          ?.englishsentence;
      if (randomOption && !allOptions.includes(randomOption)) {
        allOptions.push(randomOption);
      }
    }

    setOptions(shuffleArray(allOptions));
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleOptionSelect = (option) => {
    const correctOption =
      sentences[currentSentenceIndex]?.englishsentence || "";
    if (option === correctOption) {
      setIsCorrect(true);
      setModalImage(correctImage);
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage);
    }
    setFeedback(
      option === correctOption ? "Correct!" : "Incorrect. Try again!"
    );
    setSelectedOption(option);
    setModalVisible(true);
  };

  const goToNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setSelectedOption(null);
      setFeedback(null);
      setModalVisible(false);
    } else {
      router.push(`/themes/theme4?title=${encodeURIComponent(title)}`);
    }
  };

  const speakSentence = (sentence) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  if (sentences.length === 0) {
    return <p>Loading sentences...</p>;
  }

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Find English
      </h1>

      
      <div className="mb-6 text-center">
        <p className="text-md md:text-xl shadow-md p-2 font-semibold text-green-800">
          {currentSentence?.armeniansentence}
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
            className={`py-2 px-4 rounded-lg border-2 text-md font-semibold ${
              selectedOption === option
                ? option === currentSentence?.englishsentence
                  ? "bg-green-500 text-white border-green-700"
                  : "bg-red-500 text-white border-red-700"
                : "bg-gray-200 text-black border-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      
      {feedback && (
        <p
          className={`mt-4 text-lg font-semibold ${
            feedback === "Correct!" ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}

      
      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={goToNextSentence}
      />
    </div>
  );
};

export default Theme3Page;*/