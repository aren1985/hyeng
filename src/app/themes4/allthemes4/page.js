"use client";

import { useRouter } from "next/navigation";

// Example of themes with MongoDB _id and title
const themes = [
  { _id: "67a61c79abec530da1d77995", title: "vacation" },

  // Add more themes as needed with _id
];

const ThemeSelection = () => {
  const router = useRouter();

  const handleThemeSelect = (themeId, themeTitle) => {
    // Navigate to the Theme page with the title as a query param
    router.push(
      `/themes4/theme1?title=${encodeURIComponent(
        themeTitle
      )}&_id=${encodeURIComponent(themeId)}`
    );
  };

  return (
    <div className="flex flex-col items-center  p-6">
      <h1
        className="text-xl md:text-2xl font-bold px-3 py-2 rounded bg-white text-purple-800 mb-8 text-center 
        transform-gpu shadow-2xl"
      >
        Select a Theme
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {themes.map((theme) => (
          <button
            key={theme._id}
            onClick={() => handleThemeSelect(theme._id, theme.title)}
            className="bg-purple-800 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            {theme.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelection;
