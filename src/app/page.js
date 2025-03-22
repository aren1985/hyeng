"use client";

import React from "react";

const Homepage = () => {
  const words = ["Hello", "Goodbye", "Thank You", "Nice", "Good Job"];

  return (
    <div className="relative w-full flex flex-col items-center p-4 overflow-hidden">
      {/* Words as Background */}
      <div className="absolute inset-0 flex justify-center">
        <div className="grid grid-cols-4 gap-8 w-full h-full opacity-40">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-4xl font-bold p-6 rounded-lg shadow-lg flex justify-center items-center"
              style={{
                transform: `rotate(${index % 2 === 0 ? "-15deg" : "15deg"})`,
              }}
            >
              {words[index % words.length]}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <h1 className="md:text-4xl text-3xl bg-gray-700 text-center font-bold text-purple-600 mb-4 p-6 rounded-lg text-shadow-lg relative z-5">
        <em>Welcome to Our School</em>
      </h1>

      <p className="text-white mb-4 text-lg font-semibold relative z-5">
        <em>Տեսածանոթություն</em>
      </p>

      <div className="relative w-full h-[315px] max-w-xl mt-4 z-5 overflow-hidden border-8 border-purple-800">
        <iframe
          width="100%"
          height="490"
          src="https://www.youtube-nocookie.com/embed/2j9dRDkrzNA?si=ya7azFUsYJ6udCv5&controls=0&rel=0"
          title="YouTube video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute top-[-60px] left-0"
        ></iframe>
      </div>

      <div className="p-4 text-cyan-400 bg-gray-600 relative text-center z-5 mt-10 mb-10 text-xl rounded font-bold w-3/4">
        <em>Ամսեկան 2500 դրամ</em>
      </div>
    </div>
  );
};

export default Homepage;
