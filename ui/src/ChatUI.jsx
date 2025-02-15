import { Button, Input, LoadingOverlay, Select } from "@mantine/core"

import { useAuth } from "./hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

const baseUrl = import.meta.env.VITE_API_URL

function ChatUI() {
    const { logout } = useAuth()

    const [messages, setMessages] = useState([{ text: "Hello! How can I help you?", sender: "bot" }])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedModel, setSelectedModel] = useState("deepseek-r1:1.5b")

    const pullModel = useQuery({
        queryKey: [selectedModel],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}/models/pull?model=${selectedModel}`, { method: "GET", credentials: "include" })

            if (!response.ok) {
                throw new Error("filed to pull model")
            }

            return response.json()
        },
    })

    const sendMessage = async () => {
        if (!input.trim()) {
            return
        }

        const userMessage = { text: input, sender: "user" }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            const response = await fetch(`${baseUrl}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input, model: selectedModel }),
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            let botMessage = { text: "", sender: "bot" }
            setMessages((prev) => [...prev, botMessage])

            while (true) {
                const { value, done } = await reader.read()

                if (done) {
                    break
                }

                const chunk = decoder.decode(value, { stream: true })

                chunk.split("\n").forEach((line) => {
                    if (line.startsWith("data:")) {
                        try {
                            const parsed = JSON.parse(line.replace("data: ", ""))

                            if (parsed.response) {
                                let cleanedResponse = parsed.response.replace(/<think>|<\/think>/g, "")

                                setMessages((prev) => {
                                    const newMessages = [...prev]
                                    const lastMessageIndex = newMessages.length - 1

                                    if (newMessages[lastMessageIndex].sender === "bot") {
                                        if (!newMessages[lastMessageIndex].text.endsWith(cleanedResponse)) {
                                            newMessages[lastMessageIndex].text += cleanedResponse
                                        }
                                    }

                                    return newMessages
                                })
                            }
                        } catch (e) {
                            console.error("Error parsing stream data:", e)
                        }
                    }
                })
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen text-white">
            <LoadingOverlay visible={pullModel.isPending} loaderProps={{ type: "bars", size: 50 }}>
                <div>pulling model...</div>
            </LoadingOverlay>

            {/* Header */}
            <div className="flex justify-between space-x-4 p-4 border-b border-gray-700 bg-gray-800 w-full">
                <h2 className="text-lg font-bold">NodeOllama</h2>
                <Select data={models} value={selectedModel} onChange={setSelectedModel} searchable />
                <div className="flex space-x-4">
                    <div className="">Settings</div>
                    <div className="" onClick={() => logout.mutate()}>
                        Logout
                    </div>
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
                            disabled={loading}
                        />
                        <Button className="" onClick={sendMessage} disabled={loading}>
                            {loading ? "Thinking..." : "Send"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatUI

const models = [
    "deepseek-r1:1.5b",
    "deepseek-r1:7b",
    "deepseek-r1:8b",
    "deepseek-coder-v2:16b",
    "deepseek-coder",
    "deepseek-coder:6.7b",
    "gemma:2b",
    "gemma:7b",
    "gemma2:2b",
    "llama3.2",
    "llama3.2:1b",
    "qwen:1.8b",
    "qwen:4b",
    "qwen:7b",
]
