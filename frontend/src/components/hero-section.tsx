"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { apiClient, type ApiPost } from "@/lib/api"

export default function HeroSection() {
  const [featuredPost, setFeaturedPost] = useState<ApiPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        const posts = await apiClient.getPosts()
        if (posts.length > 0) {
          // Get the most recent post
          const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setFeaturedPost(sortedPosts[0])
        }
      } catch (error) {
        console.error("Error fetching featured post:", error)
        setError("Failed to load featured post")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPost()
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-24"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !featuredPost) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Blog</h1>
            <p className="text-lg text-gray-600 mb-8">{error || "No posts available yet. Please check back later."}</p>
            <Button asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt={featuredPost.title}
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-semibold">
              Featured
            </div>
            <div className="absolute top-1/2 right-4 bg-blue-600 text-white rounded-lg shadow-lg px-3 py-2 text-sm font-semibold">
              Latest
            </div>
            <div className="absolute bottom-4 left-1/3 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-semibold">
              {new Date(featuredPost.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Latest Post</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{featuredPost.title}</h1>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              {featuredPost.content || featuredPost.content.substring(0, 200) + "..."}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              By {getAuthorName(featuredPost.author)} • {new Date(featuredPost.createdAt).toLocaleDateString()}
            </p>
            <Button asChild size="lg">
              <Link href={`/posts/${featuredPost.id}`}>Read More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
