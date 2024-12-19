/*"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes/themik/${title}`)
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
      router.push(`/themes/theme6?title=${encodeURIComponent(title)}`);
    }
  };

  if (sentences.length === 0) {
    return <p>Loading sentences...</p>;
  }

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        Write in english
      </h1>

      
      <div className="mb-6 text-center">
        <p className="text-md shadow-md p-2 md:text-xl text-green-800 font-bold">
          {currentSentence?.armeniansentence}
        </p>
      </div>

      
      <textarea
        value={userInput}
        onChange={handleInputChange}
        className="w-full max-w-3xl p-4 text-lg border-2 rounded-lg mb-4 h-16"
        placeholder="Type your answer here..."
        rows="4"
      ></textarea>

      
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSubmit}
          className="py-2 px-6 bg-blue-500 text-white font-bold rounded-lg"
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

export default Theme4Page;*/
