import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";
import "./../styles/groups.css";

function Groups({ setPage, setSelectedGroup }) {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", members: [] });

  // Fetch groups from Supabase on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select(`id, name, group_members(id, name, email)`);
        if (error) throw error;

        const formattedGroups = data.map((g) => ({
          id: g.id,
          name: g.name,
          members: g.group_members.length,
          youOwe: 0,
          youreOwed: 0,
        }));

        setGroups(formattedGroups);
      } catch (err) {
        console.error("Error fetching groups:", err.message);
        Swal.fire("Error", "Failed to fetch groups.", "error");
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewGroup({ name: "", members: [] });
  };

  const handleChange = (e) => {
    setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
  };

  const handleAddMember = () => {
    const name = newGroup.memberName?.trim();
    const email = newGroup.memberEmail?.trim();

    if (!name || !email) {
      Swal.fire("Validation Error", "Please enter both name and email.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address.", "warning");
      return;
    }

    const emailExists = newGroup.members.some((m) => m.email === email);
    if (emailExists) {
      Swal.fire("Duplicate Email", "This email has already been added.", "warning");
      return;
    }

    const newMember = { id: Date.now(), name, email };
    setNewGroup({
      ...newGroup,
      members: [...(newGroup.members || []), newMember],
      memberName: "",
      memberEmail: "",
    });
  };

  const handleRemoveMember = (index) => {
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({ name: newGroup.name })
        .select()
        .single();
      if (groupError) throw groupError;

      if (newGroup.members.length > 0) {
        const membersToInsert = newGroup.members.map((m) => ({
          group_id: groupData.id,
          name: m.name,
          email: m.email,
        }));

        const { error: membersError } = await supabase
          .from("group_members")
          .insert(membersToInsert);
        if (membersError) throw membersError;
      }

      setGroups((prev) => [
        ...prev,
        {
          id: groupData.id,
          name: newGroup.name,
          members: newGroup.members.length,
          youOwe: 0,
          youreOwed: 0,
        },
      ]);

      handleCloseModal();
      Swal.fire("Success", "Group created successfully!", "success");

      console.log("New Group Created:", newGroup);
    } catch (err) {
      console.error("Error creating group:", err.message);
      Swal.fire("Error", "Failed to create group.", "error");
    }
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

                {/* Input fields */}
                <div className="member_inputs">
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

                {/* Add button below inputs */}
                <button type="button" className="small_btn" onClick={handleAddMember}>
                  Add
                </button>

                {/* Member list table */}
                <div className="members_list_table">
                  <div className="members_list_header">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Action</span>
                  </div>
                  {(newGroup.members || []).map((m) => (
                    <div className="members_list_row" key={m.id}>
                      <span>{m.name}</span>
                      <span>{m.email}</span>
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
                    </div>
                  ))}
                </div>
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
