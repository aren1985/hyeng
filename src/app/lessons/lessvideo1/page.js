"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";

const VidPage = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title"); // Get the title from the query params
  const [videoUrl, setVideoUrl] = useState(null);
  const router = useRouter(); // Initialize useRouter hook to navigate

  useEffect(() => {
    if (title) {
      axios
        .get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/documents/lessdocuments/${encodeURIComponent(title)}`
        )
        .then((response) => {
          const data = response.data;
          if (data && data.length > 0) {
            const video = data[0]?.themes?.[0]?.video;
            if (video) {
              setVideoUrl(video); // Set the video URL
            } else {
              console.error("No video found for this title.");
            }
          } else {
            console.error("No data found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [title]);

  const handleNextClick = () => {
    // Redirect to the LessonPage
    router.push(`/lessons/lesson?title=${title}`);
  };

  return (
    <div className="flex flex-col items-center">
      {videoUrl ? (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6">
            Watch the Video
          </h1>
          <iframe
            src={`https://www.youtube.com/embed/${videoUrl}?rel=0&modestbranding=1&showinfo=0`}
            width={500}
            height={300}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title="YouTube Video"
            className="md:w-[500px] w-screen md:h-[300px] h-[200px]"
          ></iframe>
        </div>
      ) : (
        <p>No video found.</p>
      )}

      {/* Next Button */}
      <button
        onClick={handleNextClick}
        className="bg-purple-700 hover:bg-purple-500 text-white p-3 mt-8 w-full  text-lg  rounded-lg shadow-lg font-bold border-2 border-white"
      >
        Next
      </button>
    </div>
  );
};

export default function Vidles() {
  return (
    <Suspense>
      <VidPage />
    </Suspense>
  );
}
