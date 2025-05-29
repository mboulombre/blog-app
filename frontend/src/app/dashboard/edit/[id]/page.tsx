"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthGuard from "@/components/auth-guard"
import { apiClient, type ApiPost, type CreatePostRequest } from "@/lib/api"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<ApiPost | null>(null)
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    content: "",
    excerpt: "",
    tags: [],
    published: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await apiClient.getPost(params.id)
        setPost(postData)
        setFormData({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || "",
          tags: postData.tags || [],
          published: postData.published || false,
        })
      } catch (err) {
        setError("Failed to load post")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      await apiClient.updatePost(params.id, formData)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <AuthGuard requireAdmin>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6 w-32"></div>
              <div className="bg-white rounded-lg p-8">
                <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-40 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error && !post) {
    return (
      <AuthGuard requireAdmin>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAdmin>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Edit Post</CardTitle>
              <p className="text-sm text-gray-600">Post ID: {params.id}</p>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief description of your post..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your post content here..."
                    rows={15}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter tags separated by commas..."
                  />
                </div>

                <div>
                  <Label htmlFor="published">Status</Label>
                  <Select
                    value={formData.published ? "published" : "draft"}
                    onValueChange={(value) => setFormData({ ...formData, published: value === "published" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
