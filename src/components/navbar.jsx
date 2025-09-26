function Navbar({ toggle_sidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar_left">
        <button className="burger_btn" onClick={toggle_sidebar}>
          ☰
        </button>
        <h1>HatiKo 💸</h1>
      </div>
    </nav>
  );
}

export default Navbar;
