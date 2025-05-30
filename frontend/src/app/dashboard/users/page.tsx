"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Search, Settings, Shield, User } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { apiClient, type ApiUser, type UpdateUserRequest } from "@/lib/api"

export default function UsersManagementPage() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await apiClient.getUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleUpdateUser = async (userId: string, updates: UpdateUserRequest) => {
    setUpdateLoading(true)

    try {
      const updatedUser = await apiClient.updateUser(userId, updates)
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
      setEditingUser(null)
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update user")
    } finally {
      setUpdateLoading(false)
    }
  }

  const getUserName = (user: ApiUser): string => {
    if (user.name) return user.name
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.firstName || user.lastName || user.email.split("@")[0]
  }

  const filteredUsers = users.filter((user) => {
    const name = getUserName(user).toLowerCase()
    const email = user.email.toLowerCase()
    const search = searchTerm.toLowerCase()
    return name.includes(search) || email.includes(search)
  })

  const adminCount = users.filter((u) => u.role === "admin").length
  const userCount = users.filter((u) => u.role !== "admin").length

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600">Manage all registered users</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{adminCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Search Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Users ({filteredUsers.length})
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
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
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">{searchTerm ? "No users match your search" : "No users found"}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {user.role === "admin" ? (
                            <Shield className="w-5 h-5 text-blue-600" />
                          ) : (
                            <User className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{getUserName(user)}</h3>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role || "user"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{user.email}</span>
                            {user.createdAt && <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        {/* <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DialogTrigger> */}
                        {/* <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Update user information and permissions</DialogDescription>
                          </DialogHeader>
                          {editingUser && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                if (editingUser && typeof editingUser.id === "string") {
                                  handleUpdateUser(editingUser.id, {
                                    name: formData.get("name") as string,
                                    email: formData.get("email") as string,
                                    role: formData.get("role") as "admin" | "user",
                                  })
                                } else {
                                  alert("User ID is missing or invalid.")
                                }
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  defaultValue={getUserName(editingUser)}
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
                                    <SelectItem value="admin">Administrator</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" disabled={updateLoading}>
                                  {updateLoading ? "Updating..." : "Update User"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          )}
                        </DialogContent> */}
                      </Dialog>
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
