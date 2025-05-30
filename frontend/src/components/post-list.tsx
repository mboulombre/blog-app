"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { apiClient, type ApiPost } from "@/lib/api"

export default function PostList() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await apiClient.getPosts()
        // Filter published posts
        const publishedPosts = allPosts.filter((post) => post.isPublished !== false)
        setPosts(publishedPosts)
      } catch (err) {
        setError("Failed to load posts")
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Fix the getAuthorName function to properly handle the user object structure
  const getAuthorName = (author: string | any): string => {
    if (typeof author === "string") return author
    if (!author) return "Unknown Author"

    // Handle the specific user object structure from the API
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`
    }

    return author.name || author.email || "Unknown Author"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No posts available yet.</p>
        <Button asChild>
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl hover:text-primary">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </CardTitle>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {getAuthorName(post.author)}
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.commentsCount || 0} comments
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{ post.content.substring(0, 200) + "..."}</p>
            <div className="flex justify-between items-center">
              <Button asChild variant="outline">
                <Link href={`/posts/${post.id}`}>Read More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
