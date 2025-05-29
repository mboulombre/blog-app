"use client"

import type React from "react"
import AuthGuard from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AuthGuard>
  )
}
