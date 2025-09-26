function Sidebar({ is_open, setPage }) {
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
          <li className="sidebar_only_mobile">
            <i className="fa fa-cog" aria-hidden="true"></i>
            <span>Settings</span>
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
