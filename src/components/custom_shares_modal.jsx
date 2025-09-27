// src/components/custom_shares_modal.jsx
import React from "react";

export default function CustomSharesModal({
  isModalOpen,
  newExpense,
  demo_members,
  isValidCustom,
  totalShares,
  handle_change,
  handle_share_change,
  handle_add_expense,
  handle_close_modal,
  setNewExpense,
}) {
  if (!isModalOpen) return null;

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>Add Expense</h2>
        <form onSubmit={handle_add_expense}>
          <input
            type="text"
            name="name"
            placeholder="Expense name"
            value={newExpense.name}
            onChange={handle_change}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={handle_change}
            required
          />

          {/* Paid By */}
          <select
            name="paid_by"
            value={newExpense.paid_by}
            onChange={handle_change}
            required
          >
            {demo_members.map((m) => (
              <option value={m} key={m}>{m}</option>
            ))}
          </select>

          {/* Split Section */}
          <div className="split_section">
            <div className="split_controls">
              <button
                type="button"
                className={`small_btn ${newExpense.split_mode === "equal" ? "selected" : ""}`}
                onClick={() => setNewExpense({ ...newExpense, split_mode: "equal" })}
              >
                Split equally
              </button>
              <button
                type="button"
                className={`small_btn ${newExpense.split_mode === "custom" ? "selected" : ""}`}
                onClick={() => setNewExpense({ ...newExpense, split_mode: "custom" })}
              >
                Custom shares
              </button>
            </div>

            {newExpense.split_mode === "custom" && (
              <>
                <div className="split_list">
                  {demo_members.map((m) => (
                    <div className="split_item" key={m}>
                      <span>{m}:</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={newExpense.shares[m] || ""}
                        onChange={(e) => handle_share_change(m, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {/* ⚠️ Validation message */}
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                    color: isValidCustom ? "lightgreen" : "salmon",
                  }}
                >
                  {isValidCustom
                    ? "✅ Shares match the expense amount."
                    : `⚠️ Shares total (₱${totalShares.toFixed(2)}) must equal ₱${newExpense.amount || 0}.`}
                </div>
              </>
            )}

            {newExpense.split_mode === "equal" && newExpense.amount && (
              <div className="split_preview">
                Each pays: ₱{(parseFloat(newExpense.amount) / demo_members.length).toFixed(2)}
              </div>
            )}
          </div>

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={newExpense.notes}
            onChange={handle_change}
          />
          <div className="modal_actions">
            <button type="button" onClick={handle_close_modal}>Cancel</button>
            <button
              type="submit"
              className="btn_primary"
              disabled={newExpense.split_mode === "custom" && !isValidCustom}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
