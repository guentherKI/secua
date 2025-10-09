import React from "react";
import "./Sidebar.css";

export default function Sidebar({ currentPage, setCurrentPage, profile }) {
  const navItems = [
    { key: "chats", label: "Chats" },
    { key: "contacts", label: "Kontakte" },
    { key: "history", label: "Chathistory" },
    { key: "settings", label: "Einstellungen" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="avatar">{profile.name[0]}</div>
        <div className="profile-info">
          <div>{profile.name}</div>
          <div className="profile-id">ID: {profile.id}</div>
        </div>
      </div>
      <nav>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={currentPage === item.key ? "active" : ""}
            onClick={() => setCurrentPage(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}