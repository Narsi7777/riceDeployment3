import React, { useState } from "react";
import "./ChatBot.css";
import axios from "axios";

function renderMessageText(text) {
  
    if (
        typeof text === "string" &&
        text.includes("|") &&
        text.includes("---")
    ) {
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
    // Default: just render as text
    return <span>{text}</span>;
}

const ChatBot = () => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([
        { sender: "bot", text: "How can I assist you today?" }
    ]);
    const userQueryChanged = (event) => {
        setUserInput(event.target.value);
    };
    const handleSubmitButton = async () => {
        if (!userInput.trim()) {
            return;
        }
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: userInput }
        ]);
        try {
            const results = await axios.post("/api/chatbot", { query: userInput });
           
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: results.data.response }
                ]);
            }, 500);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Sorry, there was an error. Please try again." }
            ]);
          
        }
      setUserInput('');        
    };
    return (
        <div>
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
                        onKeyDown={e => e.key === "Enter" && handleSubmitButton()}
                    />
                    <button onClick={handleSubmitButton}>Send</button>
                </div>
            </div>
        </div>
    );
};
export default ChatBot;