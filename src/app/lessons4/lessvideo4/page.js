"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";

const Vid2Page = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title"); // Get the title from query params
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter hook

  useEffect(() => {
    if (title) {
      axios
        .get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/documents4/lessdocuments4/${encodeURIComponent(title)}`
        )
        .then((response) => {
          const data = response.data;
          if (data && data.length > 0) {
            const video = data[0]?.themes?.[0]?.video;
            if (video) {
              setVideoUrl(video); // Set video URL
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [title]);

  const handleNextClick = () => {
    router.push(`/lessons4/lesson4?title=${title}`);
  };

  return (
    <div className="flex flex-col items-center p-3">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-700 text-lg font-medium">
            Loading video...
          </p>
        </div>
      ) : videoUrl ? (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6">
            Watch the Video
          </h1>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoUrl}?rel=0&modestbranding=1&showinfo=0`}
            width="560"
            height="315"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title="YouTube Video"
            className="w-full md:w-[560px] h-[200px] md:h-[315px]"
          ></iframe>
        </div>
      ) : (
        <p className="text-red-500 font-semibold">No video found.</p>
      )}

      {/* Next Button */}
      <button
        onClick={handleNextClick}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-8 w-full text-lg rounded-lg shadow-lg font-bold border-2 border-white"
      >
        Next
      </button>
    </div>
  );
};

export default function Vidles() {
  return (
    <Suspense>
      <Vid2Page />
    </Suspense>
  );
}
