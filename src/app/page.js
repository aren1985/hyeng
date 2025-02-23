import React from "react";

const Homepage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="md:text-4xl text-3xl text-center font-bold text-purple-600 mb-4 p-6 rounded-lg text-shadow-lg">
        Welcome to Our School
      </h1>
      <p className="text-white mb-4">Տեսածանոթություն..</p>
      <div className="flex justify-center w-full max-w-4xl">
        <iframe
          width={500}
          height={300}
          src="https://www.youtube.com/embed/2j9dRDkrzNA?si=ya7azFUsYJ6udCv5" // Correct YouTube embed URL
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="md:w-[500px] w-full md:h-[300px] h-[200px]"
        ></iframe>
      </div>
    </div>
  );
};

export default Homepage;
