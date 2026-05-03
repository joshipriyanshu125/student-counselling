import React, { useEffect, useState } from "react"
import socket from "../socket"
import axios from "axios"

const SupportChat = ({ roomId, user }) => {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])

    // Load old messages
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/messages/${roomId}`
            )
            setMessages(res.data)
        }
        fetchMessages()
    }, [roomId])

    // Join room
    useEffect(() => {
        socket.emit("join_room", roomId)
    }, [roomId])

    // Receive messages
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data])
        })

        return () => socket.off("receive_message")
    }, [])

    // Send message
    const sendMessage = () => {
        if (!message.trim()) return

        socket.emit("send_message", {
            roomId,
            sender: user.name,
            message,
        })

        setMessage("")
    }

    return (
        <div>
            <div style={{ height: "300px", overflowY: "scroll" }}>
                {messages.map((msg, i) => (
                    <div key={i}>
                        <b>{msg.sender}:</b> {msg.message}
                    </div>
                ))}
            </div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
            />

            <button onClick={sendMessage}>Send</button>
        </div>
    )
}

export default SupportChat;