"use client";

const Header = () => {
  return (
    <header className="bg-gray-900 text-cyan-300 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-center items-center">
        {/* Project Name on the Left */}
        <h1 className="text-xl font-bold  text-center">HiEngo</h1>
      </div>
    </header>
  );
};

export default Header;
