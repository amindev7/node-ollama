import "./App.css"
import "@mantine/core/styles.css"

import AuthForm from "./AuthForm"
import { MantineProvider } from "@mantine/core"
import { createContext } from "react"
import { useAuth } from "./hooks/useAuth"

export const AppContext = createContext()

function App() {
    const { isAuthenticated } = useAuth()

    return (
        <MantineProvider defaultColorScheme="dark">
            <AppContext.Provider value={{ isAuthenticated }}>{isAuthenticated ? <div></div> : <AuthForm />}</AppContext.Provider>
        </MantineProvider>
    )
}

export default App
