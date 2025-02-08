import { useMutation } from "@tanstack/react-query"

export function useLogin() {
    return useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Login failed")
            }

            return response.json()
        },
    })
}
