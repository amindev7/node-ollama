import "./App.css"
import "@mantine/core/styles.css"

import { createContext, useState } from "react"

import AuthForm from "./AuthForm"
import ChatUI from "./ChatUI"
import { MantineProvider } from "@mantine/core"

export const AppContext = createContext(null)

function App() {
    const [auth, setAuth] = useState({ isAuthenticated: false, showRegister: false })

    const updateAuth = (updates) => setAuth((prev) => ({ ...prev, ...updates }))

    return (
        <MantineProvider defaultColorScheme="dark">
            <AppContext.Provider value={{ auth, updateAuth }}>{auth.isAuthenticated ? <ChatUI /> : <AuthForm />}</AppContext.Provider>
        </MantineProvider>
    )
}

export default App
