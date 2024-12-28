"use client"; // This directive indicates that this component will be rendered on the client side

import React, { useState } from "react";

const VidPage = () => {
  // Array of video IDs
  const videoIds = ["zSY2Uzy5mT4", "Z_OX4iL68qs", "aiSD7-EchWk"];

  // State to keep track of the selected video ID
  const [selectedVideoId, setSelectedVideoId] = useState(videoIds[0]); // Default to the first video

  // Handle change event for the select dropdown
  const handleVideoChange = (event) => {
    setSelectedVideoId(event.target.value);
  };

  return (
    <div>
      <h1>Select a YouTube Video</h1>
      <select onChange={handleVideoChange} value={selectedVideoId}>
        {videoIds.map((id) => (
          <option key={id} value={id}>
            Video ID: {id}
          </option>
        ))}
      </select>

      <iframe
        src={`https://www.youtube.com/embed/${selectedVideoId}`}
        width="500"
        height="300"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="YouTube Video"
      ></iframe>
    </div>
  );
};

export default VidPage;
