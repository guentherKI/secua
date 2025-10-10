import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./Chats.css";

export default function Chats({ profile }) {
  const [partnerId, setPartnerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [peerId, setPeerId] = useState("");
  const peerRef = useRef(null);
  const connRef = useRef(null);

  useEffect(() => {
    // Peer initialisieren
    const peer = new Peer(profile.id, {
      host: "https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js",
      port: 443,
      path: "/",
      secure: true,
    });
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
    });

    // Eingehende Verbindung akzeptieren
    peer.on("connection", (conn) => {
      connRef.current = conn;
      setConnected(true);
      conn.on("data", (data) => {
        setMessages((msgs) => [...msgs, { from: "partner", text: data }]);
      });
    });

    return () => {
      peer.destroy();
    };
  }, [profile.id]);

  // Verbindung zu anderem Peer
  const connectToPeer = () => {
    if (!partnerId) return;
    const conn = peerRef.current.connect(partnerId);
    connRef.current = conn;
    conn.on("open", () => {
      setConnected(true);
    });
    conn.on("data", (data) => {
      setMessages((msgs) => [...msgs, { from: "partner", text: data }]);
    });
    setMessages([]);
  };

  // Nachricht senden
  const sendMessage = () => {
    if (!input.trim() || !connRef.current) return;
    connRef.current.send(input);
    setMessages((msgs) => [...msgs, { from: "me", text: input }]);
    setInput("");
  };

  return (
    <div className="app-section-container">
      <h2>Neuer Chat</h2>
      <div style={{ marginBottom: "1.7rem", fontSize: "1.13rem", color: "#8fa7c5" }}>
        <div>
          <strong>Deine ID:</strong> <code>{peerId}</code>
        </div>
        <div>
          Gib die ID deines Chatpartners ein und klicke auf <b>Verbinden</b>.
        </div>
      </div>
      <div className="start-chat">
        <input
          className="id-input"
          type="text"
          placeholder="ID des Partners"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
        />
        <button className="connect-btn" onClick={connectToPeer}>Verbinden</button>
      </div>
      <div className="peerchat-area">
        {connected ? (
          <>
            <div className="messages-list">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={msg.from === "me" ? "message me" : "message partner"}
                >
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="send-message-row">
              <input
                className="msg-input"
                placeholder="Nachricht..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}>Senden</button>
            </div>
          </>
        ) : (
          <div className="not-connected-hint">
            <em>Du bist noch nicht verbunden.</em>
          </div>
        )}
      </div>
    </div>
  );
}
