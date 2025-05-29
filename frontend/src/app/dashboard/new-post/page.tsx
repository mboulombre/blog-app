"use client"

import type React from "react"
import AuthGuard from "@/components/auth-guard"
import NewPostForm from "@/components/new-post-form"

export default function NewPostPage() {
  return (
    <AuthGuard requireAdmin>
      <NewPostForm />
    </AuthGuard>
  )
}
