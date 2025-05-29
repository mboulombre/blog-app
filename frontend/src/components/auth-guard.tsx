"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, requireAdmin = false, fallback }: AuthGuardProps) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setHasAccess(false)
      } else if (requireAdmin && !isAdmin) {
        setHasAccess(false)
      } else {
        setHasAccess(true)
      }
    }
  }, [isAuthenticated, isAdmin, requireAdmin, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {requireAdmin
                ? "You need administrator privileges to access this page."
                : "You need to be logged in to access this page."}
            </p>
            <div className="flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Button asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth/register">Create Account</Link>
                  </Button>
                </>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
