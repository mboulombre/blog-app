"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, FileText, Eye, MessageCircle } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { apiClient, type ApiPost, type ApiUser } from "@/lib/api"

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allPosts, allUsers] = await Promise.all([apiClient.getPosts(), apiClient.getUsers().catch(() => [])])
        setPosts(allPosts)
        setUsers(allUsers)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const publishedPosts = posts.filter((p) => p.isPublished !== false)
  const draftPosts = posts.filter((p) => p.isPublished === false)
  const adminUsers = users.filter((u) => u.role === "admin")
  const regularUsers = users.filter((u) => u.role !== "admin")

  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentPosts = posts.filter((post) => new Date(post.createdAt) > sevenDaysAgo)
  const recentUsers = users.filter((user) => user.createdAt && new Date(user.createdAt) > sevenDaysAgo)

  const stats = [
    {
      title: "Total Posts",
      value: posts.length,
      change: `+${recentPosts.length} this week`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Published Posts",
      value: publishedPosts.length,
      change: `${Math.round((publishedPosts.length / posts.length) * 100) || 0}% of total`,
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Total Users",
      value: users.length,
      change: `+${recentUsers.length} this week`,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Admin Users",
      value: adminUsers.length,
      change: `${Math.round((adminUsers.length / users.length) * 100) || 0}% of users`,
      icon: MessageCircle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">Overview of your blog performance and user activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Content Status</CardTitle>
                <CardDescription>Overview of your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Published Posts</span>
                    <span className="text-sm text-green-600">{publishedPosts.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${posts.length > 0 ? (publishedPosts.length / posts.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Draft Posts</span>
                    <span className="text-sm text-yellow-600">{draftPosts.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width: `${posts.length > 0 ? (draftPosts.length / posts.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Administrators</span>
                    <span className="text-sm text-blue-600">{adminUsers.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${users.length > 0 ? (adminUsers.length / users.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Regular Users</span>
                    <span className="text-sm text-purple-600">{regularUsers.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${users.length > 0 ? (regularUsers.length / users.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Recent Posts
                </CardTitle>
                <CardDescription>Latest blog posts from the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No posts created in the last 7 days</p>
                ) : (
                  <div className="space-y-3">
                    {recentPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium truncate">{post.title}</p>
                          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            post.isPublished !== false ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.isPublished !== false ? "Published" : "Draft"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  New Users
                </CardTitle>
                <CardDescription>Users who joined in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {recentUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No new users in the last 7 days</p>
                ) : (
                  <div className="space-y-3">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {user.name ||
                              (user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email.split("@")[0])}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
