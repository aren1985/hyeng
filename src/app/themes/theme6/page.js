"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";
import Image from "next/image";

// Import images for feedback
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
          } text-white py-2 rounded mt-4 text-lg w-full border-2 border-white`}
          style={{ maxWidth: "200px" }}
        >
          Next Sentence
        </button>
      </div>
    </div>
  );
};

const Theme5Page = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
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
        .get(`http://localhost:3033/themes/themik/${title}`)
        .then((response) => {
          const fetchedSentences = response.data.sentences || [];
          setSentences(fetchedSentences);
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
      sentences[currentSentenceIndex]?.armeniansentence || "";
    let allOptions = [correctOption];

    // Generate random incorrect options
    while (allOptions.length < 4) {
      const randomOption =
        sentences[Math.floor(Math.random() * sentences.length)]
          ?.armeniansentence;
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

  const playSentence = () => {
    const sentence = sentences[currentSentenceIndex]?.englishsentence;
    if (!sentence) return;

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const handleOptionSelect = (option) => {
    const correctOption =
      sentences[currentSentenceIndex]?.armeniansentence || "";
    setSelectedOption(option);
    if (option === correctOption) {
      setModalImage(correctImage);
      setIsCorrect(true);
    } else {
      setModalImage(incorrectImage);
      setIsCorrect(false);
    }
    setModalVisible(true);
  };

  const goToNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setSelectedOption(null); // Reset the selected option
      setModalVisible(false);
    } else {
      router.push(`/themes/theme7?title=${encodeURIComponent(title)}`);
    }
  };

  if (sentences.length === 0) {
    return <p>Loading sentences...</p>;
  }

  const currentSentence = sentences[currentSentenceIndex];
  const correctOption = currentSentence?.armeniansentence;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Listen And Choose
      </h1>

      {/* Play English Sentence */}
      <div className="mb-6 text-center flex flex-col items-center">
        <button
          onClick={playSentence}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg mb-4"
        >
          <FaVolumeUp className="text-3xl" />
        </button>
        <p className="text-lg font-semibold text-gray-600">
          Listen to the English sentence and select the correct Armenian
          translation.
        </p>
      </div>

      {/* Display Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`py-2 px-4 rounded-lg border-2 text-md md:text-lg font-semibold 
              ${
                selectedOption === option
                  ? option === correctOption
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-200 text-black"
              } 
              border-gray-400`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={goToNextSentence}
      />
    </div>
  );
};

export default Theme5Page;
