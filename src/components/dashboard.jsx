function Dashboard() {
  const dummy_groups = [
    { id: 1, name: "Trip to Baguio", members: 3, balance: 700 },
    { id: 2, name: "Roommates", members: 2, balance: -100 },
    { id: 3, name: "Food Buddies", members: 4, balance: 0 },
  ];

  const dummy_friends = [
    { id: 1, name: "Mika", balance: 100 },
    { id: 2, name: "Renz", balance: -50 },
    { id: 3, name: "Josh", balance: 0 },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>
        Track balances, manage expenses, and settle debts with friends and
        groups.
      </p>

      {/* Summary cards */}
      <div className="summary_cards">
        <div className="card">
            Net Balance
            <p className="pos">
            <i className="fa fa-chart-line"></i> ₱600
            </p>
        </div>

        <div className="card">
            You Owe
            <p className="neg">
            <i className="fa fa-arrow-circle-down"></i> ₱100
            </p>
        </div>

        <div className="card">
            You're Owed
            <p className="pos">
            <i className="fa fa-arrow-circle-up"></i> ₱700
            </p>
        </div>
      </div>

      <div className="main_panels">
        {/* Groups */}
        <div className="panel">
          <h2>Your Groups</h2>
          {dummy_groups.map((g) => (
            <div key={g.id} className="list_item">
              <span>
                {g.name} ({g.members} members)
              </span>
              <span className={g.balance >= 0 ? "pos" : "neg"}>
                {g.balance >= 0 ? `+ ₱${g.balance}` : `- ₱${Math.abs(g.balance)}`}
              </span>
            </div>
          ))}
        </div>

        {/* Friends */}
        <div className="panel">
          <h2>Your Friends</h2>
          {dummy_friends.map((f) => (
            <div key={f.id} className="list_item">
              <span>{f.name}</span>
              <span className={f.balance >= 0 ? "pos" : "neg"}>
                {f.balance >= 0 ? `+ ₱${f.balance}` : `- ₱${Math.abs(f.balance)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
