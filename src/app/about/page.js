"use client";

import React from "react";

const page = () => {
  return (
    <div className="relative w-full h-[315px] max-w-xl mt-4 z-5 overflow-hidden border-8 border-purple-800">
      <iframe
        width="100%"
        height="490"
        src="https://www.youtube-nocookie.com/embed/_ARUZS-bfus?rel=0&controls=0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute top-[-100px] left-0"
      ></iframe>
    </div>
  );
};

export default page;
