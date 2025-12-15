import React from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Account Provider</p>
            <p className="font-medium">
              {user?.app_metadata?.provider === "google" ? "Google" : "Email"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">User ID</p>
            <p className="text-gray-700 text-sm break-all">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
