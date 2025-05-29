"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const user = await login(email, password)
      console.log("Login successful, user:", user)

      // Redirect based on role
      if (user.role === "admin") {
        console.log("Redirecting admin to dashboard")
        router.push("/dashboard")
      } else {
        console.log("Redirecting user to home")
        router.push("/")
      }
    } catch (err) {
      console.error("Login failed:", err)
      setError("Invalid credentials. Please try again.")
    }
  }

  // Quick login functions for demo
  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError("")

    try {
      const user = await login(demoEmail, demoPassword)
      console.log("Demo login successful, user:", user)

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    } catch (err) {
      console.error("Demo login failed:", err)
      setError("Demo login failed. Please try manual login.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-3">Quick Demo Login:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleDemoLogin("admin@tumbas.com", "password123")}
                disabled={loading}
              >
                <strong>Admin Login:</strong> admin@tumbas.com
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleDemoLogin("user@example.com", "password123")}
                disabled={loading}
              >
                <strong>User Login:</strong> user@example.com
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
