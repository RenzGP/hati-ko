function Group_List({ groups, onSelect }) {
  return (
    <div className="group_list">
      <h2>Your Groups</h2>
      {groups.map(group => (
        <div
          key={group.id}
          className="group_card"
          onClick={() => onSelect(group)}
        >
          <h3>{group.name}</h3>
          <p>Members: {group.members.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default Group_List;
