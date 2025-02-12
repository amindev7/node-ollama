import "./App.css"
import "@mantine/core/styles.css"

import { createContext, useState } from "react"

import AuthForm from "./AuthForm"
import ChatUI from "./ChatUI"
import { MantineProvider } from "@mantine/core"

export const AppContext = createContext()

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    return (
        <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <MantineProvider defaultColorScheme="dark">{isAuthenticated ? <ChatUI /> : <AuthForm />}</MantineProvider>
        </AppContext.Provider>
    )
}

export default App
