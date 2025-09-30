"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function User_Details() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();

      if (!error && supabaseUser) {
        setUser(supabaseUser);
      }
    }
    getUser();
  }, []);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="user_details_page">
      <h2>User Details ⚙️</h2>
      <div className="user_info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
    </div>
  );
}

export default User_Details;
