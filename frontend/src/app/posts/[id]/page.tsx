"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, User, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import CommentSection from "@/components/comment-section"
import Image from "next/image"
import { apiClient, type ApiPost } from "@/lib/api"
import { useParams } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

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

export default  function PostDetailPage({ params }: PageProps) {
  const { id } = useParams() as { id: string }
  const [post, setPost] = useState<ApiPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postId, setPostId] = useState<string>("")

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params
      setPostId(resolvedParams.id)
    }
    initializeParams()
  }, [params])

  useEffect(() => {
     if (!postId) return

    const fetchPost = async () => {
      try {
        const postData = await apiClient.getPost(id)
        setPost(postData)
      } catch (err) {
        setError("Failed to load post")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-24"></div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-96 bg-gray-200"></div>
              <div className="p-8">
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The post you're looking for doesn't exist."}</p>
            <Button asChild>
              <Link href="/">Return to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-96 w-full">
            <Image src="/placeholder.svg?height=400&width=800" alt={post.title} fill className="object-cover" />
          </div>

          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{getAuthorName(post.author)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {getReadingTime(post.content)}
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {post.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.slice(3)}
                    </h2>
                  )
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.slice(4)}
                    </h3>
                  )
                }
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h4 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                      {paragraph.slice(2, -2)}
                    </h4>
                  )
                }
                if (paragraph.trim() === "") {
                  return <br key={index} />
                }
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>
        </article>

        <CommentSection postId={postId} />
      </div>
    </div>
  )
}
