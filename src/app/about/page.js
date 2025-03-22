"use client";

import React from "react";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>about us page</h1>
      <div className="relative w-full h-[315px] max-w-xl mt-4 z-5 overflow-hidden border-8 border-purple-800">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube-nocookie.com/embed/0sef9GYoLtw?controls=0&rel=0&modestbranding=1"
          title="YouTube video"
          frameBorder="0"
          allow="autoplay;  encrypted-media"
          allowFullScreen
          className="absolute top-[-60px] left-0"
        ></iframe>
      </div>
    </div>
  );
};

export default page;
