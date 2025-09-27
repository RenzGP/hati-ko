"use client";

import { useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Groups from "./groups";
import Friends from "./friends";
import Group_Details from "./group_details";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState("dashboard"); 
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app_layout">
      <Sidebar is_open={sidebarOpen} setPage={setPage} />
      <div className={`main_content ${sidebarOpen ? "shifted" : ""}`}>
        <Navbar toggle_sidebar={toggleSidebar} />

        {page === "dashboard" && <Dashboard />}
        {page === "groups" && (
          <Groups setPage={setPage} setSelectedGroup={setSelectedGroup} />
        )}
        {page === "friends" && <Friends />}
        {page === "group_details" && selectedGroup && (
          <Group_Details group={selectedGroup} setPage={setPage} />
        )}
      </div>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}

export default App;