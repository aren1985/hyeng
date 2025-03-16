"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import

const AdminPage = () => {
  const router = useRouter(); // Using useRouter from next/navigation
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token found
      router.push("/login");
      return;
    }

    // Decode the JWT to get user role (you can use libraries like jwt-decode)
    const user = JSON.parse(atob(token.split(".")[1])); // Decode the JWT

    if (user.role !== "admin") {
      // Redirect if the user is not an admin
      router.push("/");
    } else {
      setIsAdmin(true); // Set isAdmin to true if the user is admin
    }
  }, [router]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {isAdmin ? (
        <div>
          {/* Add admin dashboard content here */}
          <p>Welcome to the admin dashboard!</p>
        </div>
      ) : (
        <p>You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default AdminPage;
