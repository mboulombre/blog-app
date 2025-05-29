"use client"

// This file is now deprecated - keeping for backward compatibility
// Use useAuth() hook from auth-context.tsx instead

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

// Backward compatibility functions
export function getCurrentUser(): User | null {
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

export function requireAuth(): User {
  const user = getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export function requireAdmin(): User {
  const user = requireAuth()
  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }
  return user
}

// These functions are now handled by AuthProvider
export async function login(email: string, password: string): Promise<User> {
  throw new Error("Use useAuth().login instead")
}

export function logout() {
  throw new Error("Use useAuth().logout instead")
}

export function setCurrentUser(user: User | null) {
  throw new Error("User state is now managed by AuthProvider")
}
