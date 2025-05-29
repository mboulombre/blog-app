"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function UserRegistrationDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      console.log("Demo registration attempt:", formData)

      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }

      await apiClient.register(registrationData)
      setSuccess(true)
      setFormData({ firstName: "", lastName: "", email: "", password: "" })
    } catch (err) {
      console.error("Demo registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateTestUser = () => {
    const timestamp = Date.now()
    setFormData({
      firstName: "Test",
      lastName: "User",
      email: `testuser${timestamp}@example.com`,
      password: "password123",
    })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Create Test User
        </CardTitle>
        <CardDescription>Register a new user via API for testing</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>User created successfully! You can now login with these credentials.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <Button variant="outline" onClick={generateTestUser} className="w-full">
            Generate Test User Data
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="demo-firstName">First Name</Label>
              <Input
                id="demo-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <Label htmlFor="demo-lastName">Last Name</Label>
              <Input
                id="demo-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="demo-email">Email</Label>
            <Input
              id="demo-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="demo-password">Password</Label>
            <Input
              id="demo-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating User..." : "Create User"}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>API Endpoint:</strong> POST /auth/register
          </p>
          <p className="text-xs text-blue-600 mt-1">This will create a real user account in the backend database.</p>
        </div>
      </CardContent>
    </Card>
  )
}
