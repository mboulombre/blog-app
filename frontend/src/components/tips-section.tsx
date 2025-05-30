"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Package, CreditCard, TrendingUp, Users, Shield } from "lucide-react"
import Link from "next/link"
import { apiClient, type ApiPost } from "@/lib/api"

export default function TipsSection() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await apiClient.getPosts()
        // Take first 6 posts for tips section
        setPosts(allPosts.filter((post) => post.isPublished !== false).slice(0, 6))
      } catch (error) {
        console.error("Error fetching posts for tips:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const icons = [Zap, Package, CreditCard, TrendingUp, Users, Shield]
  const colors = ["bg-blue-600", "bg-gray-600", "bg-purple-600", "bg-green-600", "bg-orange-600", "bg-red-600"]

  if (loading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
          <p className="text-gray-600">Discover valuable insights from our blog</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
          <p className="text-gray-600">No articles available yet</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles from API</h2>
        <p className="text-gray-600">Discover valuable insights from our blog posts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => {
          const Icon = icons[index % icons.length]
          const colorClass = colors[index % colors.length]

          return (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${colorClass} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.content.substring(0, 100) + "..."}</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>Read more →</Link>
                  </Button>
                  <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
