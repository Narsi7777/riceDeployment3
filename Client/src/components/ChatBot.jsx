import React, { useState } from "react";
import "./ChatBot.css";
import axios from "axios";

// 🧠 Function to handle both plain text and table responses
function renderMessageText(text) {
    // ✅ Case 1: SQL / JSON array results (e.g. [{name:"narsi", age:21}, ...])
    if (Array.isArray(text) && text.length > 0 && typeof text[0] === "object") {
        const headers = Object.keys(text[0]);
        const rows = text.map((row) => Object.values(row));

        return (
            <div className="chat-table-wrapper">
                <table className="chat-table">
                    <thead>
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => (
                                    <td key={j}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // ✅ Case 2: Markdown-style table text (| Header | Header |)
    if (typeof text === "string" && text.includes("|") && text.includes("---")) {
        const lines = text.trim().split("\n").filter(line => line.trim().startsWith("|"));
        if (lines.length < 2) return <pre>{text}</pre>;

        const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
        const rows = lines.slice(2).map(row =>
            row.split("|").map(cell => cell.trim()).filter(Boolean)
        );

        return (
            <div className="chat-table-wrapper">
                <table className="chat-table">
                    <thead>
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((cells, i) => (
                            <tr key={i}>
                                {cells.map((cell, j) => (
                                    <td key={j}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // ✅ Case 3: If response is an object (not array)
    if (typeof text === "object") {
        return <pre>{JSON.stringify(text, null, 2)}</pre>;
    }

    // ✅ Default: plain text
    return <span>{text}</span>;
}

const ChatBot = () => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: "bot", text: "How can I assist you today?" },
    ]);

    const userQueryChanged = (event) => setUserInput(event.target.value);

    const handleSubmitButton = async () => {
        if (!userInput.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

        try {
            const token = localStorage.getItem("token");

            const result = await axios.post(
                "/api/chatbot",
                { query: userInput },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const botResponse = result.data.response || "No response from server.";

            // Add bot message
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: botResponse },
            ]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: `❌ Sorry, there was an error.\n${error.message}`,
                },
            ]);
        }

        setUserInput("");
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Ask me Something!</h2>
            </div>

            <div className="chatbot-body">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={
                            msg.sender === "user"
                                ? "chat-message user-message"
                                : "chat-message bot-message"
                        }
                    >
                        {renderMessageText(msg.text)}
                    </div>
                ))}
            </div>

            <div className="chatbot-footer">
                <input
                    type="text"
                    placeholder="Type your message..."
                    onChange={userQueryChanged}
                    value={userInput}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitButton()}
                />
                <button onClick={handleSubmitButton}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;
