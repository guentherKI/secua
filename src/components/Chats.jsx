import React, { useEffect, useRef, useState } from "react";
import "./Chats.css";

export default function Chats({ profile, setProfile }) {
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerAvatar, setPartnerAvatar] = useState(""); // optional URL oder Buchstabe
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [peerId, setPeerId] = useState("");
  const peerRef = useRef(null);
  const connRef = useRef(null);
  const messagesListRef = useRef(null);

  // Peer initialisieren
  useEffect(() => {
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const peer = new Peer(shortId, { debug: 2 });
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      setProfile((prev) => ({ ...prev, id }));
    });

    peer.on("connection", (conn) => {
      connRef.current = conn;
      setConnected(true);
      setPartnerId(conn.peer);

      conn.on("open", () => {
        conn.send(JSON.stringify({ type: "intro", name: profile.name }));
      });

      conn.on("data", (data) => {
        try {
          const msg = JSON.parse(data);
          if (msg.type === "intro") {
            setPartnerName(msg.name || conn.peer);
          } else if (msg.type === "message") {
            setMessages((msgs) => [...msgs, { from: "partner", text: msg.text }]);
          }
        } catch {
          setMessages((msgs) => [...msgs, { from: "partner", text: data }]);
        }
      });
    });

    return () => {
      peer.destroy();
    };
  }, [setProfile, profile.name]);

  // Automatisches Scrollen im Chatbereich
  useEffect(() => {
    if (messagesListRef.current) {
      const container = messagesListRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Verbindung zu Peer aufbauen
  const connectToPeer = () => {
    if (!partnerId) return;
    const conn = peerRef.current.connect(partnerId);
    connRef.current = conn;

    conn.on("open", () => {
      setConnected(true);
      conn.send(JSON.stringify({ type: "intro", name: profile.name }));
    });

    conn.on("data", (data) => {
      try {
        const msg = JSON.parse(data);
        if (msg.type === "intro") {
          setPartnerName(msg.name || partnerId);
        } else if (msg.type === "message") {
          setMessages((msgs) => [...msgs, { from: "partner", text: msg.text }]);
        }
      } catch {
        setMessages((msgs) => [...msgs, { from: "partner", text: data }]);
      }
    });

    setMessages([]);
  };

  // Nachricht senden
  const sendMessage = () => {
    if (!input.trim() || !connRef.current) return;
    const msg = { type: "message", text: input };
    connRef.current.send(JSON.stringify(msg));
    setMessages((msgs) => [...msgs, { from: "me", text: input }]);
    setInput("");
  };

  return (
    <div className="app-section-container">
      {!connected ? (
        <>
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
            <button className="connect-btn" onClick={connectToPeer}>
              Verbinden
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Obere Chat-Leiste mit Avatar + Name */}
          <div className="chat-top-bar">
            <div className="partner-info">
              <div className="partner-avatar">
                {partnerAvatar ? <img src={partnerAvatar} alt="Partner" /> : <span>{partnerId?.[0]}</span>}
              </div>
              <span className="chat-partner-name">
                {partnerName || partnerId || "Partner"}
              </span>
            </div>
          </div>

          {/* Chatbereich */}
          <div className="chat-box">
            <div className="messages-list" ref={messagesListRef}>
              {messages.map((msg, i) => (
                <div key={i} className={msg.from === "me" ? "message me" : "message partner"}>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Eingabezeile */}
            <div className="send-message-row">
              <input
                className="msg-input"
                placeholder="Nachricht..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}>
                Senden
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
