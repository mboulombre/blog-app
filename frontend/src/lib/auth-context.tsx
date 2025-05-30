"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "./api"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, name?: string, role?: "admin" | "user") => Promise<User>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapApiUserToUser(apiUser: any): User {
  console.log("Mapping API user:", apiUser)

  // Handle different possible response structures
  const userData = apiUser?.user || apiUser

  if (!userData) {
    console.error("No user data found in API response:", apiUser)
    throw new Error("Invalid user data received from API")
  }

  // Ensure we have required fields
  if (!userData.id && !userData._id) {
    console.error("No user ID found in user data:", userData)
    throw new Error("User ID missing from API response")
  }

  if (!userData.email) {
    console.error("No email found in user data:", userData)
    throw new Error("User email missing from API response")
  }

  const userId = userData.id || userData._id
  const userName =
    userData.name ||
    (userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData.firstName || userData.lastName || userData.email.split("@")[0])

  const mappedUser: User = {
    id: userId,
    name: userName,
    email: userData.email,
    role: userData.role || "user",
    avatar: userData.avatar,
  }

  console.log("Successfully mapped user:", mappedUser)
  return mappedUser
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check for stored user data
        const storedUser = localStorage.getItem("auth_user")
        const token = localStorage.getItem("auth_token")

        if (storedUser && token) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            apiClient.setToken(token)

            // Optionally verify with API
            try {
              const apiUser = await apiClient.getMe()
              const refreshedUser = mapApiUserToUser(apiUser)
              setUser(refreshedUser)
              localStorage.setItem("auth_user", JSON.stringify(refreshedUser))
            } catch (verifyError) {
              console.log("Token verification failed, using stored user data")
            }
          } catch (parseError) {
            console.error("Error parsing stored user data:", parseError)
            localStorage.removeItem("auth_user")
            localStorage.removeItem("auth_token")
          }
        } else if (token) {
          // Have token but no user data, try to get user info
          apiClient.setToken(token)
          try {
            const apiUser = await apiClient.getMe()
            const mappedUser = mapApiUserToUser(apiUser)
            setUser(mappedUser)
            localStorage.setItem("auth_user", JSON.stringify(mappedUser))
          } catch (error) {
            console.error("Error getting user info with token:", error)
            localStorage.removeItem("auth_token")
            apiClient.setToken(null)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Clear invalid data
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        apiClient.setToken(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true)

    try {
      console.log("Attempting login for:", email)
      const response = await apiClient.login({ email, password })
      console.log("Login response:", response)

      // Handle different possible response structures
      const userData = response.user || response.data?.user || response;
      let token = response.access_token;

      // If no token in response, check if it's already set by apiClient
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("auth_token")
      }

      console.log("Extracted user data:", userData)
      console.log("Extracted token:", token ? "Present" : "Missing")

      if (!userData) {
        throw new Error("No user data received from login")
      }

      const mappedUser = mapApiUserToUser(userData)
      setUser(mappedUser)

      // Store user data locally for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(mappedUser))
      }

      console.log("Login successful for user:", mappedUser)
      return mappedUser
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    name?: string,
    role: "admin" | "user" = "user",
  ): Promise<User> => {
    setLoading(true)

    try {
      console.log("Attempting registration for:", email, "with name:", name, "as role:", role)

      const registrationData: any = {
        email,
        password,
        role, // Include role in registration data
      }

      // Handle name splitting for firstName/lastName
      if (name) {
        const nameParts = name.trim().split(" ")
        registrationData.firstName = nameParts[0]
        registrationData.lastName = nameParts.slice(1).join(" ") || nameParts[0]
      }

      console.log("Registration data: 1", registrationData)
      const response = await apiClient.register(registrationData)
      console.log("Registration response:", response)

      const mappedUser = mapApiUserToUser(response)

      // Ensure the role is set correctly (in case API doesn't support role in registration)
      if (mappedUser.role !== role) {
        console.log(`API returned role ${mappedUser.role}, but requested ${role}. Updating locally.`)
        mappedUser.role = role
      }

      setUser(mappedUser)

      // Store user data locally for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(mappedUser))
      }

      console.log("Registration successful for user:", mappedUser)
      return mappedUser
    } catch (error) {
      console.error("Registration error:", error)
      throw new Error(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper functions for backward compatibility
export function getCurrentUser(): User | null {
  // This is a fallback for components that haven't been updated to use useAuth
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("auth_user")
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}
