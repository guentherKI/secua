import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("chats");
  const [profile, setProfile] = useState({
    id: "user-123456",
    name: "Max Mustermann",
    email: "max@example.com",
  });

  return (
    <div className="app-container">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        profile={profile}
      />
      <main className="main-content">
        <Dashboard
          currentPage={currentPage}
          profile={profile}
          setProfile={setProfile}
        />
      </main>
    </div>
  );
}