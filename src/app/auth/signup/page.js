"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success message

    // Send POST request to the backend for sign-up
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        name,
        lastname,
        nickname,
        email,
      })
      .then((response) => {
        setSuccess("User created successfully!");
        router.push("/auth/login"); // Redirect to login page after successful sign-up
      })
      .catch((err) => {
        setError(err.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="nickname"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-white">
          Already have an account?{" "}
          <a href="/auth/login" className="text-purple-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
