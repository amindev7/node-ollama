import "./App.css"
import "@mantine/core/styles.css"

import {
    Anchor,
    Button,
    Checkbox,
    MantineProvider,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core"

import { useLogin } from "./hooks/useLogin"
import { useState } from "react"

function App() {
    const { mutate: login, isPending, error } = useLogin()

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target

        setCredentials((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const onLogin = () => {
        login({ email: credentials.email, password: credentials.password })
    }

    return (
        <MantineProvider defaultColorScheme="dark">
            <div className="flex justify-center m-[10%]">
                <div className="shadow-2xl p-6 max-h-fit">
                    <div className="py-1">
                        <div className="p-4 text-2xl">
                            Welcome to NodeOllama!
                        </div>
                        <TextInput
                            label="Email address"
                            placeholder="hello@gmail.com"
                            className="mb-3"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            className="mb-3"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                        <Checkbox
                            label="Keep me logged in"
                            className="py-3"
                            name="rememberMe"
                            checked={credentials.rememberMe}
                            onChange={handleChange}
                        />
                        <Button fullWidth className="mt-3" onClick={onLogin}>
                            Login
                        </Button>
                        <Text ta="center" mt="md">
                            Don&apos;t have an account?{" "}
                            <Anchor href="#" fw={700}>
                                Register
                            </Anchor>
                        </Text>
                    </div>
                </div>
            </div>
        </MantineProvider>
    )
}

export default App
