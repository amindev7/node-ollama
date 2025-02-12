import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { AppContext } from "../App"

const baseUrl = import.meta.env.VITE_API_URL

export function useAuth(setShowRegister) {
    const { isAuthenticated, setIsAuthenticated } = useContext(AppContext)

    const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" })
    const [errors, setErrors] = useState({})

    const authStatus = useQuery({
        queryKey: ["auth-status"],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}/auth/status`, {
                method: "GET",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Not authenticated")
            }

            return response.json()
        },
    })

    useEffect(() => {
        if (!authStatus.isPending) {
            setIsAuthenticated(!!authStatus.data?.authenticated && !authStatus.error)
        }
    }, [authStatus])

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target

        setCredentials((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const validateCredentials = (isRegister) => {
        const newErrors = {}

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            newErrors.email = "Enter a valid email address."
        }

        if (isRegister) {
            if (credentials.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters long."
            }
            if (credentials.password !== credentials.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match."
            }
        }

        return newErrors
    }

    const handleSubmit = (isRegister) => {
        const validationErrors = validateCredentials(isRegister)

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

    const register = useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await fetch(`${baseUrl}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const res = await response.json()
                throw new Error(res.error || "Registration failed")
            }

            setShowRegister(false)
            return response.json()
        },
    })

    const login = useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })

            if (!response.ok) {
                const res = await response.json()
                throw new Error(res.error || "Login failed")
            }

            setIsAuthenticated(true)
            return response.json()
        },
    })

    const logout = useMutation({
        mutationFn: async () => {
            await fetch(`${baseUrl}/logout`, {
                method: "POST",
                credentials: "include",
            })
            setIsAuthenticated(false)
        },
    })

    return {
        credentials,
        errors,
        handleChange,
        handleSubmit,
        register,
        login,
        isAuthenticated,
        isPending: authStatus.isPending,
        logout,
    }
}
