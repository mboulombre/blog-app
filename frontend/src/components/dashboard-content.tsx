"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Eye, Users, FileText, MessageCircle, RefreshCw, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { apiClient, type ApiPost, type ApiUser, type CreatePostRequest, type UpdateUserRequest } from "@/lib/api"

export default function DashboardContent() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts")

  // Post creation state
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [createPostLoading, setCreatePostLoading] = useState(false)
  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: "",
    content: "",
    published: false,
  })

  // User management state
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [userUpdateLoading, setUserUpdateLoading] = useState(false)

  const { user } = useAuth()

  const fetchData = async () => {
    try {
      setError(null)
      const [allPosts, allUsers] = await Promise.all([apiClient.getPosts(), apiClient.getUsers().catch(() => [])])
      setPosts(allPosts)
      setUsers(allUsers)
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Create new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatePostLoading(true)

    try {
      const createdPost = await apiClient.createPost(newPost)
      setPosts([createdPost, ...posts])
      setShowCreatePost(false)
      setNewPost({
        title: "",
        content: "",
        published: false,
      })
    } catch (err) {
      console.error("Error creating post:", err)
      alert("Failed to create post")
    } finally {
      setCreatePostLoading(false)
    }
  }

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      await apiClient.deletePost(postId)
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post")
    }
  }

  // Update user
  const handleUpdateUser = async (userId: string, updates: UpdateUserRequest) => {
    setUserUpdateLoading(true)

    try {
      const updatedUser = await apiClient.updateUser(userId, updates)
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
      setEditingUser(null)
    } catch (err) {
      console.error("Error updating user:", err)
      alert("Failed to update user")
    } finally {
      setUserUpdateLoading(false)
    }
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

  const publishedPosts = posts.filter((p) => p.isPublished !== false)
  const draftPosts = posts.filter((p) => p.isPublished === false)

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2 w-64"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
            <p className="text-sm text-blue-600">Connected to: https://blog-app-dton.onrender.com/api/v1</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>Create a new blog post using the API</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter post title..."
                      required
                    />
                  </div>
                
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Write your post content..."
                      rows={8}
                      required
                    />
                  </div>
                 
                  <div>
                    <Label htmlFor="published">Status</Label>
                    <Select
                      value={newPost.published ? "published" : "draft"}
                      onValueChange={(value) => setNewPost({ ...newPost, published: value === "published" })}
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
                  <div className="flex gap-2">
                    <Button type="submit" disabled={createPostLoading}>
                      {createPostLoading ? "Creating..." : "Create Post"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreatePost(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <Alert className="mb-8" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">From API</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts.length}</div>
              <p className="text-xs text-muted-foreground">Live posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts.length}</div>
              <p className="text-xs text-muted-foreground">Unpublished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button variant={activeTab === "posts" ? "default" : "outline"} onClick={() => setActiveTab("posts")}>
            <FileText className="w-4 h-4 mr-2" />
            Posts Management
          </Button>
          <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}>
            <Users className="w-4 h-4 mr-2" />
            Users Management
          </Button>
        </div>

        {/* Posts Management */}
        {activeTab === "posts" && (
          <Card>
            <CardHeader>
              <CardTitle>Posts Management</CardTitle>
              <CardDescription>Manage all blog posts from the API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No posts found. Create your first post!</p>
                    <Button onClick={() => setShowCreatePost(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant={post.isPublished !== false ? "default" : "secondary"}>
                            {post.isPublished !== false ? "published" : "draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>Author: {getAuthorName(post.author)}</span>
                          <span>ID: {post.id}</span>
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>Manage all users from the API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No users found.</p>
                  </div>
                ) : (
                  users.map((apiUser) => (
                    <div key={apiUser.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{apiUser.name || apiUser.email}</h3>
                          <Badge variant={apiUser.role === "admin" ? "default" : "secondary"}>
                            {apiUser.role || "user"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Email: {apiUser.email}</span>
                          <span>ID: {apiUser.id}</span>
                          {apiUser.createdAt && <span>Joined: {new Date(apiUser.createdAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingUser(apiUser)}>
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>Update user information</DialogDescription>
                            </DialogHeader>
                            {editingUser && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget)
                                  handleUpdateUser(editingUser.id, {
                                    name: formData.get("name") as string,
                                    email: formData.get("email") as string,
                                    role: formData.get("role") as "admin" | "user",
                                  })
                                }}
                                className="space-y-4"
                              >
                                <div>
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    defaultValue={editingUser.name || ""}
                                    placeholder="User name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={editingUser.email}
                                    placeholder="user@example.com"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="role">Role</Label>
                                  <Select name="role" defaultValue={editingUser.role || "user"}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2">
                                  <Button type="submit" disabled={userUpdateLoading}>
                                    {userUpdateLoading ? "Updating..." : "Update User"}
                                  </Button>
                                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
