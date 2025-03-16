"use client";

import { useState } from "react";
import axios from "axios";

const ForgotNicknamePage = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setLoading(true);

    // Send email to the backend to retrieve the nickname
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-nickname`, {
        email,
      })
      .then((response) => {
        setNickname(response.data.nickname); // Set the retrieved nickname
      })
      .catch((err) => {
        setError("Email not found or server error.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-gray-500 p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Forgot Nickname
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {nickname && (
          <p className="text-green-500 mb-4 text-center">
            Your nickname is: {nickname}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 font-semibold bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotNicknamePage;
