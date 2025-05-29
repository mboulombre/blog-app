export interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  createdAt: string
  tags: string[]
  published: boolean
  commentCount?: number
}

export interface Comment {
  id: string
  postId: string
  content: string
  author:
    | string
    | {
        id: string
        name: string
        email: string
        firstName?: string
        lastName?: string
        role?: string
      }
  createdAt: string
  approved: boolean
  parentId?: string
  replies?: Comment[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "author" | "reader"
}
