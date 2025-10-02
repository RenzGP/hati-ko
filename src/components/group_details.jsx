"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import CustomSharesModal from "./custom_shares_modal";
import Swal from "sweetalert2";
import "./../styles/groups.css";

function Group_Details({ group, setPage }) {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Dinner", amount: 500, paid_by: "You", date: "2025-09-24" },
    { id: 2, name: "Groceries", amount: 800, paid_by: "John", date: "2025-09-23" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    paid_by: "",
    notes: "",
    split_mode: "equal",
    shares: {},
  });

  // 🔹 Member Modal state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [loadingInvite, setLoadingInvite] = useState(false);

  // 🔹 Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("id, user:user_profile(id, full_name, email)")
        .eq("group_id", group.id);

      if (error) {
        console.error("Error fetching members:", error.message);
      } else if (!data) {
        console.warn("No members found for group:", group.id);
      } else {
        const formatted = data.map((m) => ({
          id: m.id,
          name: m.user?.full_name || "Unnamed",
          email: m.user?.email || "",
        }));

        setMembers(formatted);

        if (formatted.length > 0) {
          setNewExpense((prev) => ({ ...prev, paid_by: formatted[0].name }));
        }
      }
    };

    fetchMembers();
  }, [group.id]);

  // Expense modal handlers
  const handle_open_modal = () => setIsModalOpen(true);
  const handle_close_modal = () => {
    setIsModalOpen(false);
    setNewExpense({
      name: "",
      amount: "",
      paid_by: members.length > 0 ? members[0].name : "",
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

  const totalShares = Object.values(newExpense.shares).reduce(
    (acc, v) => acc + (parseFloat(v) || 0),
    0
  );

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
          ? members.reduce((acc, m) => {
              acc[m.name] = parseFloat(newExpense.amount) / members.length;
              return acc;
            }, {})
          : newExpense.shares,
    };

    setExpenses((prev) => [expense_to_add, ...prev]);
    handle_close_modal();
  };

  // 🔹 Add Member Invite
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.email) {
      Swal.fire("Missing Email", "Please enter an email", "warning");
      return;
    }

    setLoadingInvite(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Swal.fire("Error", "You must be logged in", "error");
        return;
      }

      const { error } = await supabase.from("group_invitations").insert({
        group_id: group.id,
        email: newMember.email,
        invited_by: user.id,
      });

      if (error) throw error;

      Swal.fire("Invitation Sent", "User invited successfully 📩", "success");
      setNewMember({ name: "", email: "" });
      setIsMemberModalOpen(false);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoadingInvite(false);
    }
  };

  return (
    <div className="group_details_page">
      <button className="btn_back" onClick={() => setPage("groups")}>
        ← Back to Groups
      </button>

      <div className="group_header">
        <div>
          <h1>{group.name}</h1>
          <p>👥 {members.length} members</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn_add_expense" onClick={handle_open_modal}>
            + Add Expense
          </button>
          <button
            className="btn_add_member bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsMemberModalOpen(true)}
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Summary */}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3>{exp.name}</h3>
                  <small>
                    Paid by {exp.paid_by} • {exp.date}
                  </small>
                </div>
                <div style={{ fontWeight: "700" }}>₱{exp.amount}</div>
              </div>
              {exp.notes && (
                <p style={{ color: "#bbb", marginTop: "0.6rem" }}>{exp.notes}</p>
              )}
              {exp.shares && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                    color: "#bbb",
                  }}
                >
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
        demo_members={members.map((m) => m.name)}
        isValidCustom={isValidCustom}
        totalShares={totalShares}
        handle_change={handle_change}
        handle_share_change={handle_share_change}
        handle_add_expense={handle_add_expense}
        handle_close_modal={handle_close_modal}
        setNewExpense={setNewExpense}
      />

      {/* 🔹 Add Member Modal */}
      {isMemberModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h2>Add Member</h2>
            <form onSubmit={handleAddMember}>
              <input
                type="text"
                placeholder="Enter name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="email"
                placeholder="Enter email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingInvite}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {loadingInvite ? "Inviting..." : "Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Group_Details;
