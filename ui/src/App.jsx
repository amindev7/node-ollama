import "./App.css"
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"

function App() {
    return (
        <MantineProvider>
            <div className="bg-red-500">NodeOllama</div>
        </MantineProvider>
    )
}

export default App
