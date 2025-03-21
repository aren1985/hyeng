"use client";

import React from "react";
import Image from "next/image";
import teachik from "./../images/Teachik.png"; // Make sure this path is correct

const SimpleYouTubePlayer = () => {
  return (
    <div className="flex flex-col items-center p-4">
      {/* Teachik Image */}
      <Image src={teachik} alt="Teachik Logo" width={100} height={100} />

      {/* Video Embed */}
      <div
        className="relative w-full max-w-xl mt-4 overflow-hidden border-8 border-cyan-500"
        style={{ height: "315px" }}
      >
        {/* Wrapper div for cropping the top and bottom */}
        <iframe
          width="100%"
          height="490" // Iframe height adjusted to 500px to hide top and bottom 100px
          src="https://www.youtube-nocookie.com/embed/0sef9GYoLtw?controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute top-[-70px] left-0"
        ></iframe>
      </div>
    </div>
  );
};

export default SimpleYouTubePlayer;
