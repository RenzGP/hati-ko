import { useState } from "react";
import "./../styles/groups.css";

function Groups({ setPage, setSelectedGroup }) {
  const groups = [
    { id: 1, name: "Roommates", members: 4, youOwe: 100, youreOwed: 0 },
    { id: 2, name: "Food Group", members: 3, youOwe: 0, youreOwed: 0 },
    { id: 3, name: "Trip to Paris", members: 8, youOwe: 0, youreOwed: 700 },
  ];

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    members: [],
  });
  const [memberInput, setMemberInput] = useState("");

  // Filter groups based on search
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewGroup({ name: "", members: [] });
    setMemberInput("");
  };

  const handleChange = (e) => {
    setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
  };

  const handleAddMember = () => {
    if (memberInput.trim() !== "") {
      setNewGroup((prev) => ({
        ...prev,
        members: [...prev.members, memberInput.trim()],
      }));
      setMemberInput("");
    }
  };

  const handleRemoveMember = (index) => {
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    console.log("New Group Created:", newGroup);
    handleCloseModal();
  };

  return (
    <div className="groups_page">
      <div className="groups_header">
        <h1>Groups</h1>
        <p>Manage your expense groups and track shared expenses with friends.</p>
        <button className="btn_new_group" onClick={handleOpenModal}>
          + New Group
        </button>
      </div>

      {/* Summary Cards */}
      <div className="groups_summary">
        <div className="summary_card">
          <h3>Total Groups</h3>
          <p>{groups.length}</p>
        </div>
        <div className="summary_card">
          <h3>You Owe</h3>
          <p className="neg">₱100</p>
        </div>
        <div className="summary_card">
          <h3>You're Owed</h3>
          <p className="pos">₱700</p>
        </div>
        <div className="summary_card">
          <h3>Net Balance</h3>
          <p className="pos">₱600</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="groups_list">
        <input
          type="text"
          className="group_search"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Group cards */}
      <div className="groups_list">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((g) => (
            <div
              className="group_card"
              key={g.id}
              onClick={() => {
                console.log("Clicked group:", g);
                if (setSelectedGroup) setSelectedGroup(g);
                if (setPage) setPage("group_details");
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="group_title">
                <span className="group_icon">{g.name[0]}</span>
                <span>{g.name}</span>
              </div>
              <p>👥 {g.members} members</p>
              <p className="neg">You Owe: ₱{g.youOwe}</p>
              <p className="pos">You're Owed: ₱{g.youreOwed}</p>
            </div>
          ))
        ) : (
          <p>No groups found.</p>
        )}
      </div>

      {/* New Group Modal */}
      {isModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <input
                type="text"
                name="name"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={handleChange}
                required
              />

              {/* Add members section */}
              <div className="add_members_section">
                <h3>Members</h3>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={newGroup.memberName || ""}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, memberName: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Member Email"
                    value={newGroup.memberEmail || ""}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, memberEmail: e.target.value })
                    }
                  />
                  
                </div>
                  <button
                    type="button"
                    className="small_btn"
                    onClick={() => {
                      if (!newGroup.memberName || !newGroup.memberEmail) return;
                      const newMember = {
                        id: Date.now(),
                        name: newGroup.memberName,
                        email: newGroup.memberEmail,
                      };
                      setNewGroup({
                        ...newGroup,
                        members: [...(newGroup.members || []), newMember],
                        memberName: "",
                        memberEmail: "",
                      });
                    }}
                  >
                    Add
                  </button>
                {/* Display added members (name only) */}
                <ul>
                  {(newGroup.members || []).map((m) => (
                    <li key={m.id}>
                      {m.name}{" "}
                      <button
                        type="button"
                        className="remove_btn"
                        onClick={() =>
                          setNewGroup({
                            ...newGroup,
                            members: newGroup.members.filter((member) => member.id !== m.id),
                          })
                        }
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal_actions">
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn_primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
