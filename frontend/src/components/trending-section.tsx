"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { apiClient, type ApiPost } from "@/lib/api"

export default function TrendingSection() {
  const [trendingPosts, setTrendingPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const posts = await apiClient.getPosts()
        // Sort by creation date and take the most recent 3
        const trending = posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        setTrendingPosts(trending.filter((post) => post.isPublished !== false ) )
      } catch (err) {
        setError("Failed to load trending posts")
        console.error("Error fetching trending posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingPosts()
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
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Trending Articles You Need To Read
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-2 w-16"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mt-2 w-20"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error || trendingPosts.length === 0) {
    return (
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Trending Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">{error || "No trending posts available"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Trending Articles You Need To Read
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {trendingPosts.map((post) => (
          <div key={post.id} className="flex gap-4">
            <Image
            src={(post.imageUrl ? `${post.imageUrl}?height=80&width=80` : "/placeholder.svg?height=200&width=300")}
              alt={post.title}
              width={80}
              height={80}
              className="rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1">
              {/* <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{getCategory(post)}</span> */}
              <h4 className="text-sm font-semibold text-gray-900 mt-1 leading-tight">
                <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h4>
              <p className="text-xs text-gray-500 mt-1">By {getAuthorName(post.author)}</p>
              <Button variant="link" className="p-0 h-auto text-xs mt-2" asChild>
                <Link href={`/posts/${post.id}`}>Read More →</Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
