"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Grab token from URL fragment
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // Store session so Supabase knows the user
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleReset = async () => {
    if (!password) {
      Swal.fire("Error", "Password cannot be empty.", "error");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Password updated successfully!", "success").then(
        () => {
          router.push("/login");
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Loading session…</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-neutral-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-center text-white mb-4">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 rounded border border-gray-700 bg-neutral-800 text-white mb-4 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
