import { useState } from "react";
import CustomSharesModal from "./custom_shares_modal"

function Group_Details({ group, setPage }) {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Dinner", amount: 500, paid_by: "You", date: "2025-09-24" },
    { id: 2, name: "Groceries", amount: 800, paid_by: "John", date: "2025-09-23" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    paid_by: "You",
    notes: "",
    split_mode: "equal", // equal or custom
    shares: {}, // { member: shareAmount }
  });

  const demo_members = ["You", "John", "Jane"];

  const handle_open_modal = () => setIsModalOpen(true);
  const handle_close_modal = () => {
    setIsModalOpen(false);
    setNewExpense({
      name: "",
      amount: "",
      paid_by: "",
      notes: "",
      split_mode: "equal",
      shares: {},
    });
  };

  const handle_change = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handle_share_change = (member, value) => {
    setNewExpense((prev) => ({
      ...prev,
      shares: {
        ...prev.shares,
        [member]: value ? parseFloat(value) : 0,
      },
    }));
  };

  // Calculate total custom shares
  const totalShares = Object.values(newExpense.shares).reduce(
    (acc, v) => acc + (parseFloat(v) || 0),
    0
  );

  // Validate custom shares only if in "custom" mode
  const isValidCustom =
    newExpense.split_mode === "custom"
      ? parseFloat(newExpense.amount) === totalShares
      : true;

  const handle_add_expense = (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;

    if (newExpense.split_mode === "custom" && !isValidCustom) {
      alert("⚠️ The total custom shares must equal the expense amount.");
      return;
    }

    const expense_to_add = {
      id: Date.now(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      paid_by: newExpense.paid_by,
      date: new Date().toISOString().slice(0, 10),
      notes: newExpense.notes,
      split_mode: newExpense.split_mode,
      shares:
        newExpense.split_mode === "equal"
          ? demo_members.reduce((acc, m) => {
              acc[m] = parseFloat(newExpense.amount) / demo_members.length;
              return acc;
            }, {})
          : newExpense.shares,
    };

    setExpenses((prev) => [expense_to_add, ...prev]);
    handle_close_modal();
  };

  return (
    <div className="group_details_page">
      <button className="btn_back" onClick={() => setPage("groups")}>
        ← Back to Groups
      </button>

      <div className="group_header">
        <div>
          <h1>{group.name}</h1>
          <p>👥 {group.members} members</p>
        </div>
        <button className="btn_add_expense" onClick={handle_open_modal}>
          + Add Expense
        </button>
      </div>

      <div className="groups_summary" style={{ marginBottom: "1rem" }}>
        <div className="summary_card">
          <h3>You Owe</h3>
          <p className="neg">₱{group.youOwe}</p>
        </div>
        <div className="summary_card">
          <h3>You're Owed</h3>
          <p className="pos">₱{group.youreOwed}</p>
        </div>
      </div>

      {/* Expense List */}
      <div className="expense_list">
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          expenses.map((exp) => (
            <div className="expense_card" key={exp.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{exp.name}</h3>
                  <small>Paid by {exp.paid_by} • {exp.date}</small>
                </div>
                <div style={{ fontWeight: "700" }}>₱{exp.amount}</div>
              </div>
              {exp.notes && <p style={{ color: "#bbb", marginTop: "0.6rem" }}>{exp.notes}</p>}
              {exp.shares && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#bbb" }}>
                  Split:{" "}
                  {Object.entries(exp.shares).map(([m, val]) => (
                    <span key={m} style={{ marginRight: "0.6rem" }}>
                      {m}: ₱{val}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      <CustomSharesModal
        isModalOpen={isModalOpen}
        newExpense={newExpense}
        demo_members={demo_members}
        isValidCustom={isValidCustom}
        totalShares={totalShares}
        handle_change={handle_change}
        handle_share_change={handle_share_change}
        handle_add_expense={handle_add_expense}
        handle_close_modal={handle_close_modal}
        setNewExpense={setNewExpense}
      />
    </div>
  );
}

export default Group_Details;
