"use client";

import React from "react";

const Homepage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center p-4">
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
      <h1 className="md:text-4xl text-3xl text-center font-bold text-purple-600 mb-4 p-6 rounded-lg text-shadow-lg relative z-10">
        <em>Welcome to Our School</em>
      </h1>
      <p className="text-white mb-4 text-lg font-semibold relative z-10">
        <em>Տեսածանոթություն</em>
      </p>
      <div className="flex justify-center w-full max-w-4xl relative z-10">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/2j9dRDkrzNA?si=ya7azFUsYJ6udCv5"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full md:w-[560px] h-[200px] md:h-[315px]"
        ></iframe>
      </div>
    </div>
  );
};

export default Homepage;
