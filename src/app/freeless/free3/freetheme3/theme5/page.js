"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Import images for feedback
import correctImage from "../../../../images/newlike.webp";
import incorrectImage from "../../../../images/dislike.webp";
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

const Theme4Page = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes3/themik3/${title}`)
        .then((response) => {
          const fetchedSentences = response.data.sentences || [];
          setSentences(fetchedSentences);
        })
        .catch((err) => {
          console.error("Error fetching sentences:", err);
        });
    }
  }, [title]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    const correctAnswer = sentences[currentSentenceIndex]?.englishsentence
      .trim()
      .toLowerCase();

    if (userInput.trim().toLowerCase() === correctAnswer) {
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
      setUserInput("");
      setModalVisible(false);
    } else {
      router.push(
        `/freeless/free3/freetheme3/theme6?title=${encodeURIComponent(title)}`
      );
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

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Write in english
      </h1>

      <div className="mb-6 text-center">
        <p className="text-md shadow-md py-2 px-3 rounded md:text-lg text-white bg-gray-800 font-semibold">
          {currentSentence?.armeniansentence}
        </p>
      </div>

      <textarea
        value={userInput}
        onChange={handleInputChange}
        className="w-full max-w-3xl p-3 text-lg border-2 rounded-lg mb-4 "
        placeholder="Type your answer here..."
        rows="2"
      ></textarea>

      <div className="flex space-x-4 w-full mt-4">
        <button
          onClick={handleSubmit}
          className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        >
          check Answer
        </button>
      </div>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={goToNextSentence}
      />
    </div>
  );
};

export default function Th4pp() {
  return (
    <Suspense>
      <Theme4Page />
    </Suspense>
  );
}
