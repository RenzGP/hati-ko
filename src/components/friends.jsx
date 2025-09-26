import { useState } from "react";
import "./../styles/friends.css";

function Friends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: "", balance: 0 });

  const [friends, setFriends] = useState([
    { id: 1, name: "Byron Rice", balance: 100 },
    { id: 2, name: "Cherry Terry", balance: 100 },
    { id: 3, name: "Harrison", balance: 0 },
    { id: 4, name: "Damion", balance: -50 },
    { id: 5, name: "Elsa Moran", balance: 100 },
    { id: 6, name: "Rita", balance: 0 },
    { id: 7, name: "Will Wiggins", balance: -200 },
  ]);

  // Filter friends by search
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submit for new friend
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!newFriend.name.trim()) return;

    setFriends([
      ...friends,
      { id: friends.length + 1, name: newFriend.name, balance: 0 },
    ]);
    setNewFriend({ name: "", balance: 0 });
    setShowAddFriend(false);
  };

  return (
    <div className="friends_page">
      {/* Header */}
      <div className="friends_header">
        <h1>Friends</h1>
        <p>
          Manage your friends to easily add them to expense groups and track
          debts.
        </p>
        <button className="btn_add_friend" onClick={() => setShowAddFriend(true)}>
          + Add Friend
        </button>
      </div>

      {/* Summary Cards */}
      <div className="friends_summary">
        <div className="summary_card">
          <h3>Net Balance</h3>
          <p className="pos">₱600</p>
        </div>
        <div className="summary_card">
          <h3>Owed to You</h3>
          <p className="pos">₱800</p>
        </div>
        <div className="summary_card">
          <h3>You Owe</h3>
          <p className="neg">₱200</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="friends_list">
        <input
          type="text"
          className="friend_search"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Friend cards */}
      <div className="friends_list">
        {filteredFriends.map((f) => (
          <div className="friend_card" key={f.id}>
            <div className="friend_name">
              <span className="friend_icon">
                {f.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
              <span>{f.name}</span>
            </div>
            {f.balance > 0 ? (
              <p className="pos">Owes You ₱{f.balance}</p>
            ) : f.balance < 0 ? (
              <p className="neg">You Owe ₱{Math.abs(f.balance)}</p>
            ) : (
              <p className="settled">All settled up</p>
            )}
          </div>
        ))}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h2>Add Friend</h2>
            <form onSubmit={handleAddFriend}>
              <input
                type="text"
                placeholder="Friend's Name"
                value={newFriend.name}
                onChange={(e) =>
                  setNewFriend({ ...newFriend, name: e.target.value })
                }
              />
              <div className="modal_actions">
                <button type="submit" className="btn_primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn_secondary"
                  onClick={() => setShowAddFriend(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Friends;
