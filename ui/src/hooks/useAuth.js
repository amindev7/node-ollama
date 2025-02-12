import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

const baseUrl = import.meta.env.VITE_API_URL

export function useAuth(setShowRegister) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({})

    const { data, error, isPending } = useQuery({
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
        if (isPending) {
            return
        }
        if (error) {
            setIsAuthenticated(false)
        } else if (data?.authenticated) {
            setIsAuthenticated(true)
        }
    }, [data, error])

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

            if (setShowRegister) {
                setShowRegister(false)
            }

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

            if (setIsAuthenticated) {
                setIsAuthenticated(true)
            }

            return response.json()
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
        isPending,
    }
}
