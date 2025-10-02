"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";
import "./../styles/groups.css";

function Groups({ setPage, setSelectedGroup }) {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", members: [] });

  // Fetch groups only where the logged-in user is a member
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        const { data, error } = await supabase
          .from("group_members")
          .select(
            `
            group:groups (
              id,
              name,
              group_members (
                id,
                user_id,
                user:user_profile (
                  id,
                  email,
                  username
                )
              )
            )
          `
          )
          .eq("user_id", user.id);

        if (error) throw error;

        const formattedGroups =
          data?.map((gm) => ({
            id: gm.group.id,
            name: gm.group.name,
            members: gm.group.group_members?.length || 0,
            youOwe: 0,
            youreOwed: 0,
          })) || [];

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
    const email = newGroup.memberEmail?.trim();

    if (!email) {
      Swal.fire("Validation Error", "Please enter an email.", "warning");
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

    const newMember = { id: Date.now(), email };
    setNewGroup({
      ...newGroup,
      members: [...(newGroup.members || []), newMember],
      memberEmail: "",
    });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({ name: newGroup.name })
        .select()
        .single();

      if (groupError) throw groupError;

      const { error: creatorError } = await supabase.from("group_members").insert({
        group_id: groupData.id,
        user_id: user.id,
      });
      if (creatorError) throw creatorError;

      for (let member of newGroup.members) {
        const { data: userMatch, error: userError } = await supabase
          .from("user_profile")
          .select("id")
          .eq("email", member.email)
          .maybeSingle();

        if (userError) throw userError;

        if (userMatch) {
          const { error: memberInsertError } = await supabase
            .from("group_members")
            .insert({
              group_id: groupData.id,
              user_id: userMatch.id,
            });
          if (memberInsertError) throw memberInsertError;
        } else {
          const { error: inviteError } = await supabase
            .from("group_invitations")
            .insert({
              group_id: groupData.id,
              email: member.email,
              invited_by: user.id,
            });
          if (inviteError) throw inviteError;
        }
      }

      setGroups((prev) => [
        ...prev,
        {
          id: groupData.id,
          name: newGroup.name,
          members: newGroup.members.length + 1,
          youOwe: 0,
          youreOwed: 0,
        },
      ]);

      handleCloseModal();
      Swal.fire("Success", "Group created successfully!", "success");
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

                <div className="member_inputs">
                  <input
                    type="email"
                    placeholder="Member Email"
                    value={newGroup.memberEmail || ""}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, memberEmail: e.target.value })
                    }
                  />
                </div>

                <button type="button" className="small_btn" onClick={handleAddMember}>
                  Add
                </button>

                <div className="members_list_table">
                  <div className="members_list_header">
                    <span>Email</span>
                    <span>Action</span>
                  </div>
                  {(newGroup.members || []).map((m) => (
                    <div className="members_list_row" key={m.id}>
                      <span>{m.email}</span>
                      <button
                        type="button"
                        className="remove_btn"
                        onClick={() =>
                          setNewGroup({
                            ...newGroup,
                            members: newGroup.members.filter(
                              (member) => member.id !== m.id
                            ),
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
