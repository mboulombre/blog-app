"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search, Filter, Trash2, Check, X, Eye } from "lucide-react"
import Link from "next/link"
import AdminSidebar from "@/components/admin-sidebar"
import { apiClient, type ApiComment, type ApiPost } from "@/lib/api"

export default function CommentsManagementPage() {
  const [comments, setComments] = useState<ApiComment[]>([])
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts first
        const allPosts = await apiClient.getPosts()
        setPosts(allPosts)

        // Fetch comments for all posts
        const allComments: ApiComment[] = []
        for (const post of allPosts.slice(0, 5)) {
          // Limit to first 5 posts for demo
          try {
            const postComments = await apiClient.getComments(post.id)
            allComments.push(...postComments)
          } catch (error) {
            console.log(`No comments for post ${post.id}`)
          }
        }
        setComments(allComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      await apiClient.deleteComment(commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Failed to delete comment")
    }
  }

  const getAuthorName = (author: string | any): string => {
    if (typeof author === "string") return author
    if (!author) return "Anonymous"

    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`
    }

    return author.name || author.email?.split("@")[0] || "Anonymous"
  }

  const getAuthorInitials = (author: string | any): string => {
    const name = getAuthorName(author)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getPostTitle = (postId: string): string => {
    const post = posts.find((p) => p.id === postId)
    return post?.title || "Unknown Post"
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAuthorName(comment.author).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && comment.approved !== false) ||
      (statusFilter === "pending" && comment.approved === false)

    return matchesSearch && matchesStatus
  })

  const approvedCount = comments.filter((c) => c.approved !== false).length
  const pendingCount = comments.filter((c) => c.approved === false).length

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comments Management</h1>
              <p className="text-gray-600">Moderate and manage user comments</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{comments.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search comments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Comments</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                All Comments ({filteredComments.length})
              </CardTitle>
              <CardDescription>Moderate user comments and replies</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No comments match your filters" : "No comments found"}
                  </p>
                  <p className="text-sm text-gray-400">Comments will appear here as users engage with your posts</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredComments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt={getAuthorName(comment.author)} />
                          <AvatarFallback className="text-sm">{getAuthorInitials(comment.author)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{getAuthorName(comment.author)}</span>
                            <Badge variant={comment.approved !== false ? "default" : "secondary"}>
                              {comment.approved !== false ? "approved" : "pending"}
                            </Badge>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            On:{" "}
                            <Link href={`/posts/${comment.postId}`} className="text-blue-600 hover:underline">
                              {getPostTitle(comment.postId)}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{comment.content}</p>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/posts/${comment.postId}`}>
                                <Eye className="w-3 h-3 mr-1" />
                                View Post
                              </Link>
                            </Button>
                            {comment.approved === false && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Check className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            {comment.approved !== false && (
                              <Button size="sm" variant="outline">
                                <X className="w-3 h-3 mr-1" />
                                Unapprove
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
