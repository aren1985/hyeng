"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import correctImage from "../../Images/newlike.webp";
import incorrectImage from "../../Images/dislike.webp";
import { FaVolumeUp } from "react-icons/fa"; // Using volume-up icon for listening

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
          style={{ maxWidth: "200px" }}
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

const Words4Page = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(""); // Store the user's typed answer
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const router = useRouter();

  useEffect(() => {
    if (title) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/words/wordik/${title}`)
        .then((response) => {
          setWords(response.data.words || []);
        })
        .catch((err) => {
          setError("Failed to load words. Please try again.");
        });
    }
  }, [title]);

  const speakWord = () => {
    const currentWord = words[currentWordIndex];
    const speech = new SpeechSynthesisUtterance(currentWord?.english);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const checkAnswer = () => {
    const currentWord = words[currentWordIndex];
    const correctAnswer = currentWord.english.toLowerCase().trim();
    if (userAnswer.toLowerCase().trim() === correctAnswer) {
      setIsCorrect(true);
      setModalImage(correctImage); // Show "like" image if correct
    } else {
      setIsCorrect(false);
      setModalImage(incorrectImage); // Show "dislike" image if incorrect
    }
    setModalVisible(true); // Show the modal after checking answer
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserAnswer(""); // Reset input field
      setIsCorrect(null);
      setModalVisible(false); // Close modal
    } else {
      router.push(`/words/words5?title=${encodeURIComponent(title)}`);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  const currentWord = words[currentWordIndex];

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-purple-800">
        listen and write
      </h1>

      <button
        onClick={speakWord}
        className="bg-orange-500 text-white py-2 px-6 rounded mb-6 text-lg font-semibold flex items-center justify-center"
      >
        <FaVolumeUp className="mr-2" />
        Listening...
      </button>

      <div className="mb-6">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="py-2 px-6 rounded-lg text-lg border-2"
          placeholder="Type the English word"
        />
      </div>

      <button
        onClick={checkAnswer}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
        disabled={!userAnswer} // Disable if input field is empty
      >
        Check Answer
      </button>

      <Modal
        visible={modalVisible}
        imageSrc={modalImage}
        isCorrect={isCorrect}
        onNext={nextWord}
      />
    </div>
  );
};

export default function W4Pg() {
  return (
    <Suspense>
      <Words4Page />
    </Suspense>
  );
}
