"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle, Shield, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "admin" | "user",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const { register, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setDebugInfo("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      setDebugInfo(`Attempting registration for: ${formData.email} with name: ${fullName} as ${formData.role}`)

      console.log("Form submission - attempting registration with:", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName,
        role: formData.role,
      })
       
        
      const user = await register(formData.email, formData.password, fullName, formData.role)

      setDebugInfo(`Registration successful! User: ${JSON.stringify(user)}`)
      console.log("Registration successful, redirecting...")

      // Small delay to show success message
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/dashboard")
        } else {
          router.push("/")
        }
      }, 1000)
    } catch (err) {
      console.error("Registration error:", err)
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again."
      setError(errorMessage)
      setDebugInfo(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Quick registration with demo data
  const handleQuickRegister = async (userType: "admin" | "user") => {
    setIsLoading(true)
    setError("")
    setDebugInfo("")

    const timestamp = Date.now()
    const demoData = {
      admin: {
        firstName: "Admin",
        lastName: "User",
        email: `admin-${timestamp}@example.com`,
        password: "password123",
        role: "admin" as const,
      },
      user: {
        firstName: "Test",
        lastName: "User",
        email: `user-${timestamp}@example.com`,
        password: "password123",
        role: "user" as const,
      },
    }

    const data = demoData[userType]
    setDebugInfo(`Quick registering ${userType}: ${data.email}`)

    try {
      console.log("Quick registering:", data)
      const user = await register(data.email, data.password, `${data.firstName} ${data.lastName}`, data.role)
      setDebugInfo(`Quick registration successful! User: ${JSON.stringify(user)}`)

      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/dashboard")
        } else {
          router.push("/")
        }
      }, 1000)
    } catch (err) {
      console.error("Quick registration error:", err)
      const errorMessage = err instanceof Error ? err.message : "Quick registration failed"
      setError(errorMessage)
      setDebugInfo(`Quick registration error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to start writing and sharing your stories</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugInfo && !error && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-mono">{debugInfo}</AlertDescription>
            </Alert>
          )}

          {/* Quick Registration Options */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Quick registration for testing:</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickRegister("user")}
                disabled={isLoading}
                className="flex-1 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Register as User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickRegister("admin")}
                disabled={isLoading}
                className="flex-1 flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Shield className="w-4 h-4" />
                Register as Admin
              </Button>
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-gray-600 text-center">Or create a custom account:</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password (min 6 characters)"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
           
            <Button type="submit" className="w-full" disabled={isLoading || loading}>
              {isLoading || loading
                ? "Creating account..."
                : `Create ${formData.role === "admin" ? "Admin" : "User"} Account`}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
