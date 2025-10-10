import React from "react";
import Chats from "./Chats";
import Contacts from "./Contacts";
import History from "./History";
import Settings from "./Settings";

export default function Dashboard({ currentPage, profile, setProfile }) {
  return (
    <>
      {currentPage === "chats" && <Chats profile={profile} setProfile={setProfile} />}
      {currentPage === "contacts" && <Contacts />}
      {currentPage === "history" && <History />}
      {currentPage === "settings" && <Settings />}
    </>
  );
}
