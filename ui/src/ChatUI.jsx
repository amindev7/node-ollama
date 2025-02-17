import { Button, Input, LoadingOverlay, Select } from "@mantine/core"

import { useAuth } from "./hooks/useAuth"
import { useChat } from "./hooks/useChat"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

function ChatUI() {
    const [selectedModel, setSelectedModel] = useState("deepseek-r1:1.5b")
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const { mutate, messages } = useChat(selectedModel)

    const { logout } = useAuth()

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

    const sendMessage = () => {
        if (input.trim()) {
            mutate(input)
            console.log(input)
            setInput("")
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
                {/* <div className="w-64 p-4">
                    Search chat
                    <div className="space-y-3">
                        <button className="w-full p-1 text-left bg-gray-700 rounded-lg">Chat 1</button>
                        <button className="w-full p-1 text-left bg-gray-700 rounded-lg">Chat 2</button>
                    </div>
                </div> */}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-2 p-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}>
                                {msg.content}
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
