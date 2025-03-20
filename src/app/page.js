"use client";

import React from "react";

const Homepage = () => {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center p-4">
      {Array.from({ length: 20 }).map((_, index) => (
        <span
          key={index}
          className="absolute text-6xl font-bold"
          style={{
            top: `${(index % 5) * 20}%`,
            left: `${(index % 4) * 25}%`,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            transform: `rotate(${Math.random() * 30 - 15}deg) skew(${
              Math.random() * 20 - 10
            }deg)`,
            opacity: 0.7,
          }}
        >
          {
            [
              "Hello",
              "Hi",
              "Welcome",
              "Happy",
              "Thank You",
              "Goodbye",
              "Class",
              "English",
            ][index % 8]
          }
        </span>
      ))}
      <h1 className="md:text-4xl text-3xl bg-gray-700 text-center font-bold text-purple-600 mb-4 p-6 rounded-lg text-shadow-lg relative z-5">
        <em>Welcome to Our School</em>
      </h1>
      <p className="text-white mb-4 text-lg font-semibold relative z-5">
        <em>Տեսածանոթություն</em>
      </p>
      <div className="flex justify-center w-full max-w-4xl relative z-5">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/2j9dRDkrzNA?si=ya7azFUsYJ6udCv5"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full md:w-[560px] h-[200px] md:h-[315px] border-4 border-cyan-500"
        ></iframe>
      </div>
      <div className="p-4 text-cyan-400 bg-gray-600 relative text-center z-5 mt-10 mb-10 text-xl rounded font-bold w-3/4">
        <em>Ամսեկան 2500 դրամ</em>
      </div>
    </div>
  );
};

export default Homepage;
