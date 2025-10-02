"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function User_Details() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function getUserProfile() {
      try {
        // Get currently logged-in user
        const {
          data: { user: supabaseUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !supabaseUser) {
          setErrorMsg("Failed to get logged-in user.");
          setLoading(false);
          return;
        }

        // Fetch user profile from user_profile table by email
        const { data, error: profileError } = await supabase
          .from("user_profile") // singular table name
          .select("id, email, full_name, username, created_at")
          .eq("email", supabaseUser.email)
          .single();

        if (profileError || !data) {
          setErrorMsg("Failed to fetch user profile.");
          setLoading(false);
          return;
        }

        setUser(data);
      } catch (err) {
        setErrorMsg("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getUserProfile();
  }, []);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (errorMsg) {
    return <p>{errorMsg}</p>;
  }

  return (
    <div className="user_details_page">
      <h2>User Details ⚙️</h2>
      <div className="user_info">
        <p><strong>Email:</strong> {user.email ?? "Not set"}</p>
        <p><strong>Username:</strong> {user.username ?? "Not set"}</p>
        <p><strong>User ID:</strong> {user.id ?? "Not set"}</p>
        <p><strong>Created At:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : "Not set"}</p>
      </div>
    </div>
  );
}

export default User_Details;
