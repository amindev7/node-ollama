import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

const baseUrl = import.meta.env.VITE_API_URL

export const useChat = (model) => {
    const [messages, setMessages] = useState([])

    const streamOllamaResponse = async (messages, onChunk) => {
        const response = await fetch(`${baseUrl}/chat`, {
            method: "POST",
            body: JSON.stringify({ model, messages, stream: true, options }),
            headers: { "Content-Type": "application/json" },
        })

        if (!response.body) {
            console.error("❌ No response body!")
            return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                break
            }

            const chunk = decoder.decode(value, { stream: true })
            onChunk(chunk)
        }
    }

    const mutation = useMutation({
        mutationFn: async (newMessage) => {
            const updatedMessages = [...messages, { role: "user", content: newMessage }]
            setMessages([...updatedMessages, { role: "assistant", content: "" }])

            let assistantResponse = ""

            await streamOllamaResponse(updatedMessages, (chunk) => {
                // ✅ Extract JSON from chunk
                const lines = chunk.split("\n").filter((line) => line.startsWith("data: "))
                for (const line of lines) {
                    try {
                        const json = JSON.parse(line.replace("data: ", ""))
                        if (json.message?.content) {
                            let cleanContent = json.message.content

                            // 🚫 Remove <think> and </think> tags from the content
                            cleanContent = cleanContent.replace(/<think>|<\/think>/g, "")

                            assistantResponse += cleanContent // ✅ Append cleaned content

                            setMessages((prev) => {
                                const lastMessage = prev[prev.length - 1]

                                if (lastMessage.role === "assistant") {
                                    return [...prev.slice(0, -1), { role: "assistant", content: assistantResponse }]
                                }
                                return [...prev, { role: "assistant", content: assistantResponse }]
                            })
                        }
                    } catch (error) {
                        console.error("❌ JSON Parse Error:", error, "Chunk:", line)
                    }
                }
            })
        },
    })

    return { ...mutation, messages }
}

// Options configuration
const options = {
    num_keep: 5, // Keep last 5 tokens in memory
    seed: 42, // Seed for reproducibility
    num_predict: 100, // Generate 100 tokens
    top_k: 20, // Top 20 tokens to sample from
    top_p: 0.9, // Nucleus sampling (90% cumulative probability)
    min_p: 0.0, // Minimum token probability
    typical_p: 0.7, // Typicality penalty (for more typical results)
    repeat_last_n: 33, // Don't repeat the last 33 tokens
    temperature: 0.8, // Randomness control
    repeat_penalty: 1.2, // Penalty for repeating tokens
    presence_penalty: 1.5, // Encourage new concepts
    frequency_penalty: 1.0, // Penalty for frequent tokens
    mirostat: 1, // Enable Mirostat algorithm for response length control
    mirostat_tau: 0.8, // Mirostat target length
    mirostat_eta: 0.6, // Mirostat adjustment factor
    penalize_newline: true, // Penalize newline tokens
    stop: ["\n", "user:"], // Stop generation on newlines or user prefix
    numa: false, // Non-Uniform Memory Access (NUMA) disabled
    num_ctx: 1024, // Context size
    num_batch: 2, // Batch size
    num_gpu: 1, // Number of GPUs to use
    main_gpu: 0, // Primary GPU (if multiple)
    low_vram: false, // VRAM usage (false to disable)
    vocab_only: false, // Use vocab only (false for full model)
    use_mmap: true, // Use memory-mapped files
    use_mlock: false, // Do not lock model weights in memory
    num_thread: 8, // Number of threads for inference
}
