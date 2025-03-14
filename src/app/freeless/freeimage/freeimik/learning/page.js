"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FaVolumeUp } from "react-icons/fa"; // Import the volume up icon

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const router = useRouter();
  const cache = useRef({}); // Caching mechanism

  useEffect(() => {
    if (selectedCategory) {
      // Check if we have cached data for this category
      if (cache.current[selectedCategory]) {
        setImages(cache.current[selectedCategory]);
        setLoading(false);
      } else {
        // Fetch images using then/catch
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/images/allik/${selectedCategory}`
          ) // Updated endpoint
          .then((response) => {
            setImages(response.data);
            cache.current[selectedCategory] = response.data; // Cache the response
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching images:", err);
            setError("Failed to load images. Please try again later.");
            setLoading(false);
          });
      }
    }
  }, [selectedCategory]);

  const speakName = (name) => {
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = "en-GB"; // Explicitly set language to US English
    utterance.rate = 0.8;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Find a preferred voice, e.g., "Samantha" for iOS English
    const preferredVoice = voices.find((voice) =>
      voice.name.includes("Samantha")
    );

    // Set the preferred voice if available
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Speak the name
    window.speechSynthesis.speak(utterance);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Redirect to the next quiz page when finished
      router.push(
        `/freeless/freeimage/freeimik/imagetrain?category=${selectedCategory}`
      );
    }
  };

  // Loading or error handling
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-700 text-lg font-medium">Loading ...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;
  if (images.length === 0) return <p>No images available for this category.</p>;

  const currentImage = images[currentIndex] || {};

  return (
    <div className="flex flex-col items-center p-3">
      <h1 className="mt-6 mb-6 text-2xl font-bold text-purple-800">
        Listen and remember
      </h1>
      <h1 className="text-xl text-center w-64 shadow-md px-2 py-1 font-semibold rounded bg-gray-400 text-green-700 mb-4">
        {currentImage.name}
      </h1>
      <img
        src={`data:image/jpeg;base64,${currentImage.image}`}
        alt={`Image of ${currentImage.name}`}
        className="w-64 h-36 md:h-44 rounded"
      />
      <button
        onClick={() => speakName(currentImage.name)}
        className="bg-blue-600 text-white font-semibold justify-center w-64 py-2 px-4 rounded mb-4 mt-4 flex items-center" // Centering the icon
      >
        <FaVolumeUp className="mr-2 text-xl" />
        Listen Name
      </button>
      <button
        onClick={nextImage}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-10 w-full text-lg  rounded shadow-lg font-bold border-2 border-white"
      >
        Next
      </button>
    </div>
  );
};

export default function lolo() {
  return (
    <Suspense>
      <ImagesPage />
    </Suspense>
  );
}
