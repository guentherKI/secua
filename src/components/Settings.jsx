import React, { useState } from "react";
import "./Settings.css";

export default function Settings({ profile, setProfile }) {
  const [name, setName] = useState(profile.name);

  const handleSave = () => {
    setProfile({ ...profile, name });
    alert("Profil aktualisiert!");
  };

  return (
    <div className="app-section-container app-settings-scroll">
      <h2>Einstellungen</h2>
      <label>
        <span>Name:</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <div style={{ fontSize: "1.15rem", margin: "1.5rem 0" }}>
        <strong>Deine ID:</strong> <code>{profile.id}</code>
      </div>
      <button onClick={handleSave}>Speichern</button>
      <div style={{marginTop: "2rem", fontSize: "1.07rem", color: "#8fa7c5"}}>
        <p>Hier können weitere Einstellungen ergänzt werden.</p>
      </div>
    </div>
  );
}