import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { AppContext } from "../App"

const baseUrl = import.meta.env.VITE_API_URL

export function useAuth() {
    const { isAuthenticated, updateAuth, showRegister } = useContext(AppContext)

    const [credentials, setCredentials] = useState(initialValues)
    const [errors, setErrors] = useState({})

    const authStatus = useQuery({
        queryKey: ["auth-status"],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}/auth/status`, { method: "GET", credentials: "include" })

            if (!response.ok) {
                throw new Error("Not authenticated")
            }

            return response.json()
        },
    })

    useEffect(() => {
        setCredentials(initialValues)
    }, [showRegister])

    useEffect(() => {
        if (authStatus.isPending) return
        updateAuth({ isAuthenticated: !!authStatus.data?.authenticated && !authStatus.error })
    }, [authStatus.error, authStatus.isPending, authStatus.data])

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
                credentials: "include",
            })

            if (!response.ok) {
                const res = await response.json()
                throw new Error(res.error || "Registration failed")
            }

            updateAuth({ showRegister: false, isAuthenticated: true })
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

            updateAuth({ showRegister: false, isAuthenticated: true })
            return response.json()
        },
    })

    const logout = useMutation({
        mutationFn: async () => {
            await fetch(`${baseUrl}/logout`, {
                method: "POST",
                credentials: "include",
            })
        },
        onSuccess: () => updateAuth({ isAuthenticated: false }),
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

const initialValues = { email: "", password: "", confirmPassword: "" }
