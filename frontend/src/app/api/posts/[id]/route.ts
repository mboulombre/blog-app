import { NextResponse } from "next/server"

// Mock database - in a real app, this would be your actual database
const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with the latest features in Next.js 15.",
    content: "Full content here...",
    author: "John Doe",
    createdAt: "2024-01-15",
    tags: ["Next.js", "React", "Web Development"],
    published: true,
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const post = posts.find((p) => p.id === params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const postIndex = posts.findIndex((p) => p.id === params.id)

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // In a real app, you would validate the user owns this post
    posts[postIndex] = { ...posts[postIndex], ...body }

    return NextResponse.json(posts[postIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const postIndex = posts.findIndex((p) => p.id === params.id)

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // In a real app, you would validate the user owns this post
    posts.splice(postIndex, 1)

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
