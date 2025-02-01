// pages/profile.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/auth/login"); // Redirect to login if not authenticated
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}

export default Profile;
