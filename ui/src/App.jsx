import "./App.css"
import "@mantine/core/styles.css"

import { createContext, useState } from "react"

import AuthForm from "./AuthForm"
import { MantineProvider } from "@mantine/core"

export const AppContext = createContext()

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    return (
        <MantineProvider defaultColorScheme="dark">
            <AppContext.Provider value={{ isAuthenticated }}>
                {isAuthenticated ? (
                    <div></div>
                ) : (
                    <AuthForm setIsAuthenticated={setIsAuthenticated} />
                )}
            </AppContext.Provider>
        </MantineProvider>
    )
}

export default App
