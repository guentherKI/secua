import React, { useEffect, useRef, useState } from "react";
import "./Chats.css";

export default function Chats({ profile, setProfile }) {
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState(""); // 🔹 Name des Partners
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [peerId, setPeerId] = useState("");
  const peerRef = useRef(null);
  const connRef = useRef(null);

  useEffect(() => {
    // 🔹 6-stellige Großbuchstaben-ID generieren
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const peer = new Peer(shortId, { debug: 2 });
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      setProfile((prev) => ({ ...prev, id }));
    });

    // 🔹 Eingehende Verbindung
    peer.on("connection", (conn) => {
      connRef.current = conn;
      setConnected(true);
      setPartnerId(conn.peer);

      conn.on("open", () => {
        // Name vom Sender abfragen, falls er direkt geschickt wird
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
          // Fallback für alte Textnachrichten
          setMessages((msgs) => [...msgs, { from: "partner", text: data }]);
        }
      });
    });

    return () => {
      peer.destroy();
    };
  }, [setProfile, profile.name]);

  const connectToPeer = () => {
    if (!partnerId) return;
    const conn = peerRef.current.connect(partnerId);
    connRef.current = conn;

    conn.on("open", () => {
      setConnected(true);
      // 🔹 Eigenen Namen an Partner senden
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
          <div
            style={{
              marginBottom: "1.7rem",
              fontSize: "1.13rem",
              color: "#8fa7c5",
            }}
          >
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
          <h2>Chat mit {partnerName || partnerId}</h2>
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              Senden
            </button>
          </div>
        </>
      )}
    </div>
  );
}
