// src/app/reset-password/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase will attach `access_token` in the URL hash
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      setValid(true); // token exists → show reset form
    }
    setLoading(false);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      Swal.fire("Success", "Password updated successfully!", "success").then(() => {
        router.push("/"); // back to login
      });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (!valid) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Invalid Link</h2>
        <p>The reset link is invalid or expired. Please request a new one.</p>
      </div>
    );
  }

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="modal_actions">
            <button type="submit" className="btn_primary">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
