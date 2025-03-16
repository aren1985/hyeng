"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext"; // Import AuthContext

const ProfilePage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="flex justify-center items-center bg-gray-800 text-white">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-700 p-8 mt-32 rounded-lg shadow-lg w-full sm:w-96 text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Profile</h2>
        <p className="text-lg">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-lg">
          <strong>Lastname:</strong> {user.lastname}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
