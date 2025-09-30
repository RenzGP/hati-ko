"use client";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";

function Sidebar({ is_open, setPage }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Logged Out", "You have been logged out successfully.", "success");
      window.location.href = "/"; // redirect to landing/login
    }
  };

  return (
    <aside className={`sidebar ${is_open ? "open" : "closed"}`}>
      <h2 className="logo">HatiKo 💸</h2>
      <nav>
        <ul>
          <li onClick={() => setPage("dashboard")}>
            <i className="fa fa-home" aria-hidden="true"></i>
            <span>Dashboard</span>
          </li>
          <li onClick={() => setPage("groups")}>
            <i className="fa fa-users" aria-hidden="true"></i>
            <span>Groups</span>
          </li>
          <li onClick={() => setPage("friends")}>
            <i className="fa fa-user-friends" aria-hidden="true"></i>
            <span>Friends</span>
          </li>
          <li className="sidebar_only_mobile" onClick={() => setPage("user_details")}>
            <i className="fa fa-cog" aria-hidden="true"></i>
            <span>Settings</span>
          </li>
          <li onClick={handleLogout}>
            <i className="fa fa-sign-out-alt" aria-hidden="true"></i>
            <span>Logout</span>
          </li>
        </ul>
      </nav>
      <div className="sidebar_footer">
        <p>Dark Mode 🌙</p>
      </div>
    </aside>
  );
}

export default Sidebar;
