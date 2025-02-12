import "./App.css"
import "@mantine/core/styles.css"

import { createContext, useState } from "react"

import AuthForm from "./AuthForm"
import ChatUI from "./ChatUI"
import { MantineProvider } from "@mantine/core"
import { Toaster } from "react-hot-toast"

export const AppContext = createContext(null)

function App() {
    const [auth, setAuth] = useState({ isAuthenticated: false, showRegister: false })

    const updateAuth = (updates) => setAuth((prev) => ({ ...prev, ...updates }))

    return (
        <MantineProvider defaultColorScheme="dark">
            <AppContext.Provider value={{ auth, updateAuth }}>{auth.isAuthenticated ? <ChatUI /> : <AuthForm />}</AppContext.Provider>
            <Toaster toastOptions={{ style: { background: "#242424", color: "#fff" } }} />
        </MantineProvider>
    )
}

export default App
