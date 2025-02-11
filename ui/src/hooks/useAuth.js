import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

const initialCredentials = {
    email: "",
    password: "",
    confirmPassword: "",
}

const baseUrl = import.meta.env.VITE_API_URL

export function useAuth(setIsAuthenticated) {
    const register = useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await fetch(`${baseUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const res = await response.json()
                throw new Error(res.error || "Registration failed")
            }

            return response.json()
        },
    })

    const login = useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const res = await response.json()
                throw new Error(res.error || "Login failed")
            }
            setIsAuthenticated(true)
            return response.json()
        },
    })

    const validateCredentials = (creds, isRegister) => {
        const newErrors = {}

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creds.email)) {
            newErrors.email = "Enter a valid email address."
        }

        if (isRegister) {
            if (creds.password.length < 6) {
                newErrors.password =
                    "Password must be at least 6 characters long."
            }
            if (creds.password !== creds.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match."
            }
        }

        return newErrors
    }

    return {
        login,
        register,
        validateCredentials,
        initialCredentials,
    }
}
