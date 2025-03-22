"use client";

import React from "react";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>about us page</h1>
      <div className="relative w-full h-[315px] max-w-xl mt-4 z-5 overflow-hidden border-8 border-purple-800">
        <div className="absolute inset-0 w-full h-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/0sef9GYoLtw?controls=1&rel=0&modestbranding=1"
            title="YouTube video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
        {/* Dark div to cover YouTube watermark, fixed and independent of iframe height changes */}
        <div className="absolute bottom-0 right-0 w-[200px] h-[30px] bg-black z-10"></div>
      </div>
    </div>
  );
};

export default page;
