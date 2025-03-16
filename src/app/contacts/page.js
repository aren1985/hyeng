"use client";

import React from "react";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

const ContactsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-8  p-6">
      <p className="text-purple-800 text-lg font-semibold mb-8 bg-gray-200 p-3 rounded">
        <em>Հարցերի դեպքում գրել մեզ </em>
      </p>
      <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">Feel free to reach out to us!</p>

        <div className="flex flex-col space-y-4">
          {/* Facebook Link */}
          <a
            href="https://www.facebook.com/YOUR_PAGE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 text-white bg-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <FaFacebook size={20} />
            <span>Facebook</span>
          </a>

          {/* Email Link */}
          <a
            href="mailto:your@email.com"
            className="flex items-center justify-center space-x-2 text-white bg-green-600 px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <FaEnvelope size={20} />
            <span>Email</span>
          </a>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/YOUR_PAGE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 text-white bg-pink-600 px-4 py-2 rounded-lg shadow-md hover:bg-pink-700 transition"
          >
            <FaInstagram size={20} />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
