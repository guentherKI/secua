import React from "react";
import Settings from "./Settings";
import Chats from "./Chats";
import Contacts from "./Contacts";
import History from "./History";

export default function Dashboard({ currentPage, profile, setProfile }) {
  if (currentPage === "chats") return <Chats profile={profile} />;
  if (currentPage === "contacts") return <Contacts />;
  if (currentPage === "history") return <History />;
  if (currentPage === "settings")
    return <Settings profile={profile} setProfile={setProfile} />;
  return null;
}