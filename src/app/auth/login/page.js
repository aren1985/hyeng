"use client";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../AuthContext"; // Import AuthContext

const SignInPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Use AuthContext to access login function and auth state
  const { isLoggedIn, login } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success message

    // Send POST request to the backend for sign-in
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        nickname,
        email,
      })
      .then((response) => {
        const { token, user } = response.data; // user should now be included in the response

        login(user); // Pass user data to AuthContext

        // Store the token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to home page after successful login
        router.push("/");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-gray-500 p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Sign In
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Nickname
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-white">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-purple-600 hover:underline">
            Sign up
          </a>
        </p>
        <p className="text-center mt-2 text-sm text-white">
          Forgot your nickname?{" "}
          <a
            href="/auth/forgot-password"
            className="text-purple-600 hover:underline"
          >
            Click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
