"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Users, FileText, Settings } from "lucide-react"
import UserRegistrationDemo from "@/components/user-registration-demo"
import { apiClient } from "@/lib/api"

export default function DemoPage() {
  const [apiInfo, setApiInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [id, setId] = useState("")

  const testApiConnection = async () => {
    setLoading(true)
    try {
      const info = await apiClient.getAppInfo()
      setApiInfo(info)
    } catch (error) {
      console.error("API connection failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Demo & Testing</h1>
          <p className="text-lg text-gray-600 mb-6">Test all features with the real backend API</p>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            https://blog-app-dton.onrender.com/api/v1
          </Badge>
        </div>

        <Tabs defaultValue="connection" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">
              <Database className="w-4 h-4 mr-2" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="posts">
              <FileText className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="management">
              <Settings className="w-4 h-4 mr-2" />
              Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Connection Test</CardTitle>
                <CardDescription>Test connection to the backend API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={testApiConnection} disabled={loading}>
                    {loading ? "Testing..." : "Test API Connection"}
                  </Button>

                  {apiInfo && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">✅ API Connected Successfully</h3>
                      <pre className="text-sm text-green-700 bg-green-100 p-2 rounded">
                        {JSON.stringify(apiInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserRegistrationDemo />

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Available user operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">GET /users</span>
                      <Badge variant="outline">List all users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">GET /users/{email}</span>
                      <Badge variant="outline">Get user by email</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">PATCH /users/{id}</span>
                      <Badge variant="outline">Update user</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Posts Operations</CardTitle>
                <CardDescription>Available post management operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Read Operations</h4>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">GET /posts</span>
                      <Badge variant="outline">List all posts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">GET /posts/{id}</span>
                      <Badge variant="outline">Get single post</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Write Operations</h4>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">POST /posts</span>
                      <Badge variant="outline">Create post</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span className="font-medium">PATCH /posts/{id}</span>
                      <Badge variant="outline">Update post</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="font-medium">DELETE /posts/{id}</span>
                      <Badge variant="outline">Delete post</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Full CRUD Dashboard</CardTitle>
                <CardDescription>Complete management interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">The dashboard provides full CRUD operations for both posts and users:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Posts Management</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Create new posts with rich content</li>
                        <li>• Edit existing posts inline</li>
                        <li>• Delete posts with confirmation</li>
                        <li>• Toggle publish/draft status</li>
                        <li>• Manage tags and metadata</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">User Management</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• View all registered users</li>
                        <li>• Update user information</li>
                        <li>• Change user roles (admin/user)</li>
                        <li>• Monitor user activity</li>
                        <li>• Real-time user statistics</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button asChild>
                      <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/auth/login">Login to Test</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
