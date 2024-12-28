import React from "react";
import Link from "next/link";

const SignPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-notebook-pattern shadow-lg rounded-lg p-8 w-full max-w-md border-2 border-gray-300">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Sign Up
        </h1>
        <form className="space-y-6 ">
          <div className="relative">
            <label className="block text-white">Name</label>
            <div className="border-2 border-solid border-gray-400 border-t-gray-400">
              <input
                type="text"
                className="w-full p-1 bg-transparent focus:outline-none focus:ring-0 text-white"
                placeholder="Write your first name"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-white">Surname</label>
            <div className="border-2 border-solid border-gray-400 border-t-gray-400">
              <input
                type="text"
                className="w-full p-1 bg-transparent focus:outline-none focus:ring-0 text-white"
                placeholder="Write your surname"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-white">Email Address</label>
            <div className="border-2 border-solid border-gray-400 border-t-gray-400">
              <input
                type="email"
                className="w-full p-1 bg-transparent focus:outline-none focus:ring-0 text-white"
                placeholder="Write your email"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-white">Password</label>
            <div className="border-2 border-solid border-gray-400 border-t-gray-400">
              <input
                type="password"
                className="w-full p-1 bg-transparent focus:outline-none focus:ring-0 text-white"
                placeholder="Write your password"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-white">Confirm Password</label>
            <div className="border-2 border-solid border-gray-400 border-t-gray-400">
              <input
                type="password"
                className="w-full p-1 bg-transparent focus:outline-none focus:ring-0 text-white"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <Link
            href="/auth/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignPage;
