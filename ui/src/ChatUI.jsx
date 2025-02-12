import { Button, Input } from "@mantine/core"

import { useAuth } from "./hooks/useAuth"
import { useState } from "react"

function ChatUI() {
    const { logout } = useAuth()

    const [messages, setMessages] = useState([{ text: "Hello! How can I help you?", sender: "bot" }])
    const [input, setInput] = useState("")

    const sendMessage = () => {
        if (!input.trim()) return
        setMessages([...messages, { text: input, sender: "user" }])
        setInput("")
    }

    return (
        <div className="h-screen text-white">
            {/* Header */}
            <div className="flex items-center justify-end space-x-4 p-4 border-b border-gray-700 bg-gray-800">
                <h2 className="text-lg font-bold">NodeOllama</h2>
                <div className="flex items-center space-x-4">Settings</div>
                <div className="flex items-center space-x-4" onClick={() => logout.mutate()}>
                    Logout
                </div>
            </div>

            <div className="flex h-11/12">
                {/* Sidebar */}
                <div className="w-64 p-4">
                    Search chat
                    <div className="space-y-3">
                        <button className="w-full p-1 text-left bg-gray-700 rounded-lg">Chat 1</button>
                        <button className="w-full p-1 text-left bg-gray-700 rounded-lg">Chat 2</button>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-2 p-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2 p-4 border-t border-gray-700">
                        <Input
                            className="flex-1"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button className="" onClick={sendMessage}></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatUI
