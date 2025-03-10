"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa";
import Image from "next/image";

// Import images for feedback
import correctImage from "../../images/newlike.webp";
import incorrectImage from "../../images/dislike.webp";
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes4/themik4/${title}`)
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
    utterance.lang = "en-GB"; // Set language to British English (or change to "en-US" for American)
    utterance.rate = 0.8; // Adjust speed for clarity

    // Get available voices and select a specific one if needed
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Samantha") // Replace with your preferred voice
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const handleOptionSelect = (option) => {
    // Store selected option but do not trigger modal yet
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    const correctOption =
      sentences[currentSentenceIndex]?.armeniansentence || "";
    if (selectedOption === correctOption) {
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
      setModalVisible(false); // Hide the modal
    } else {
      router.push(`/themes4/theme7?title=${encodeURIComponent(title)}`);
    }
  };

  if (sentences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-700 text-lg font-medium">
          Loading theme...
        </p>
      </div>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];
  const correctOption = currentSentence?.armeniansentence;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Listen And Choose
      </h1>

      <div className="mb-6 text-center flex flex-col items-center">
        <button
          onClick={playSentence}
          className="text-white bg-purple-800 p-3 rounded-full shadow-lg mb-4"
        >
          <FaVolumeUp className="text-3xl" />
        </button>
        <p className="text-lg font-semibold text-gray-600">
          Listen to the English sentence and select the correct Armenian
          translation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`py-2 px-4 rounded-lg border-2 text-md md:text-lg font-semibold 
              ${
                selectedOption === option
                  ? option === correctOption
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              } 
              border-gray-400`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Check Answer Button */}
      <button
        onClick={handleCheckAnswer}
        disabled={selectedOption === null} // Disable if no option is selected
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Check Answer
      </button>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={goToNextSentence}
      />
    </div>
  );
};

export default function Th5p() {
  return (
    <Suspense>
      <Theme5Page />
    </Suspense>
  );
}
