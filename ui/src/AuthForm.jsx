import { Anchor, Button, PasswordInput, Text, TextInput } from "@mantine/core"

import { AppContext } from "./App"
import { useAuth } from "./hooks/useAuth"
import { useContext } from "react"

function AuthForm() {
    const { setShowRegister, showRegister } = useContext(AppContext)
    const { credentials, errors, handleChange, handleSubmit, register, login, isPending } = useAuth()

    const resError = register.isError || login.isError
    const errMessage = register.error?.message || login.error?.message

    if (isPending) {
        return null
    }

    return (
        <div className="flex justify-center m-[10%]">
            <div className="shadow-2xl p-6 max-h-fit">
                <div className="py-1 w-96">
                    <div className="p-4 text-2xl">{showRegister ? "Create an account" : "Welcome to NodeOllama!"}</div>
                    {resError && <div className="text-red-500">{errMessage || "Something went wrong"}</div>}
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
                    {showRegister && (
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            className="mb-3"
                            name="confirmPassword"
                            value={credentials.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />
                    )}
                    <Button fullWidth className="mt-3" onClick={() => handleSubmit(showRegister)}>
                        {showRegister ? "Register" : "Login"}
                    </Button>
                    <Text ta="center" mt="md">
                        {showRegister ? (
                            <>
                                Already have an account? <Anchor onClick={() => setShowRegister(false)}>Login</Anchor>
                            </>
                        ) : (
                            <>
                                Don&apos;t have an account? <Anchor onClick={() => setShowRegister(true)}>Register</Anchor>
                            </>
                        )}
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default AuthForm
