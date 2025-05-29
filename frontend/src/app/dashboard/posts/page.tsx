"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react"
import Link from "next/link"
import AdminSidebar from "@/components/admin-sidebar"
import { apiClient, type ApiPost } from "@/lib/api"

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await apiClient.getPosts()
        setPosts(allPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      await apiClient.deletePost(postId)
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  const getAuthorName = (author: string | any): string => {
    if (typeof author === "string") return author
    if (!author) return "Unknown Author"

    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`
    }

    return author.name || author.email || "Unknown Author"
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.published !== false) ||
      (statusFilter === "draft" && post.published === false)

    return matchesSearch && matchesStatus
  })

  const publishedCount = posts.filter((p) => p.published !== false).length
  const draftCount = posts.filter((p) => p.published === false).length

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Posts Management</h1>
              <p className="text-gray-600">Manage all blog posts</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-post">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
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
                      placeholder="Search posts..."
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
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
              <CardDescription>Manage your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== "all" ? "No posts match your filters" : "No posts found"}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/new-post">Create Your First Post</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant={post.published !== false ? "default" : "secondary"}>
                            {post.published !== false ? "published" : "draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {getAuthorName(post.author)}</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.tags && post.tags.length > 0 && <span>Tags: {post.tags.slice(0, 2).join(", ")}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/posts/${post.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
