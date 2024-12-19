"use client";

import React, { useEffect, useState, useRef } from "react";
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
    window.speechSynthesis.speak(utterance);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Redirect to the next quiz page when finished
      router.push(`/basic/next-quiz?category=${selectedCategory}`);
    }
  };

  // Loading or error handling
  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;
  if (images.length === 0) return <p>No images available for this category.</p>;

  const currentImage = images[currentIndex] || {};

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl md:text-2xl shadow-md font-semibold text-green-800 mb-4">
        {currentImage.name}
      </h1>
      <img
        src={`data:image/jpeg;base64,${currentImage.image}`}
        alt={`Image of ${currentImage.name}`}
        className="w-64 h-36 md:h-44"
      />
      <button
        onClick={() => speakName(currentImage.name)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 mt-4 flex items-center" // Centering the icon
      >
        <FaVolumeUp className="mr-2" />
        listen Name
      </button>
      <button
        onClick={nextImage}
        className="bg-green-500 text-white py-2 px-4 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default ImagesPage;
