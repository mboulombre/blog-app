"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { apiClient, type ApiPost } from "@/lib/api"

export default function RecentArticles() {
  const [articles, setArticles] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const posts = await apiClient.getPosts()
        // Get the 3 most recent posts
        const recentPosts = posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        setArticles(recentPosts)
      } catch (err) {
        setError("Failed to load articles")
        console.error("Error fetching articles:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
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
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Recent Articles</h2>
            <p className="text-gray-600">Stay informed with our latest insights</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Recent Articles</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Recent Articles</h2>
          <p className="text-gray-600">No articles available yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Recent Articles</h2>
          <p className="text-gray-600">Stay informed with our latest insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={(article.imageUrl ? `${article.imageUrl}?height=200&width=300` : "/placeholder.svg?height=200&width=300")}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  <Link href={`/posts/${article.id}`}>{article.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.content || article.content.substring(0, 150) + "..."}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">By {getAuthorName(article.author)}</span>
                  <Button variant="outline" asChild>
                    <Link href={`/posts/${article.id}`}>Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
