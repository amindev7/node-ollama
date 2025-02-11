import "./App.css"
import "@mantine/core/styles.css"

import {
    Anchor,
    Button,
    MantineProvider,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core"
import { createContext, useState } from "react"

import { useAuth } from "./hooks/useAuth"

export const AppContext = createContext()

function App() {
    const {
        initialCredentials,
        validateCredentials,
        login,
        register,
        isAuthenticated,
    } = useAuth()

    const [showRegister, setShowRegister] = useState(false)
    const [errors, setErrors] = useState({})
    const [credentials, setCredentials] = useState(initialCredentials)

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target

        setCredentials((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = (isRegister) => {
        const validationErrors = validateCredentials(credentials, isRegister)

        if (Object.keys(validationErrors).length) {
            return setErrors(validationErrors)
        }

        setErrors({})

        const authAction = isRegister ? register : login

        authAction.mutate({
            email: credentials.email,
            password: credentials.password,
        })
    }

    const resError = register.isError || login.isError
    const errMessage = register.error?.message || login.error?.message

    return (
        <MantineProvider defaultColorScheme="dark">
            <AppContext.Provider value={{ isAuthenticated }}>
                {isAuthenticated ? "YES" : "NO"}
                <div className="flex justify-center m-[10%]">
                    <div className="shadow-2xl p-6 max-h-fit">
                        <div className="py-1 w-96">
                            <div className="p-4 text-2xl">
                                {showRegister
                                    ? "Create an account"
                                    : "Welcome to NodeOllama!"}
                            </div>
                            {resError ? (
                                <div className="text-red-500">
                                    {errMessage || "Something went wrong"}
                                </div>
                            ) : null}
                            <div></div>
                            <TextInput
                                label="Email address"
                                placeholder="hello@gmail.com"
                                className="mb-3"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                className="mb-3"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            {showRegister ? (
                                <PasswordInput
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    className="mb-3"
                                    name="confirmPassword"
                                    value={credentials.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                />
                            ) : null}
                            <Button
                                fullWidth
                                className="mt-3"
                                onClick={() => handleSubmit(showRegister)}
                            >
                                {showRegister ? "Register" : "Login"}
                            </Button>
                            <Text ta="center" mt="md">
                                {showRegister ? (
                                    <>
                                        Already have an account?{" "}
                                        <Anchor
                                            onClick={() => {
                                                setShowRegister(false)
                                                setCredentials(
                                                    initialCredentials
                                                )
                                            }}
                                        >
                                            Login
                                        </Anchor>
                                    </>
                                ) : (
                                    <>
                                        Don&apos;t have an account?{" "}
                                        <Anchor
                                            onClick={() => {
                                                setShowRegister(true)
                                                setCredentials(
                                                    initialCredentials
                                                )
                                            }}
                                        >
                                            Register
                                        </Anchor>
                                    </>
                                )}
                            </Text>
                        </div>
                    </div>
                </div>
            </AppContext.Provider>
        </MantineProvider>
    )
}

export default App
