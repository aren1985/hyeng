"use client";

import React from "react";

const Homepage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="md:text-4xl text-3xl text-center font-bold text-purple-600 mb-4 p-6 rounded-lg text-shadow-lg">
        <em>Welcome to Our School</em>
      </h1>
      <p className="text-white mb-4 text-lg font-semibold">
        <em>Տեսածանոթություն</em>
      </p>
      <div className="flex justify-center w-full max-w-4xl">
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
      <div className="font-bold text-2xl">
        <p className="text-blue-900">hello</p>
        <p className="text-yellow-600">բարև</p>
      </div>
      <div className="font-bold text-2xl">
        <p className="text-blue-900">good bye</p>
        <p className="text-yellow-600">հաջողություն</p>
      </div>
    </div>
  );
};

export default Homepage;
