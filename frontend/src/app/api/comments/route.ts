import { NextResponse } from "next/server"

// Mock database for comments
const comments = [
  {
    id: "1",
    postId: "1",
    content: "Great article! Very helpful.",
    author: "Alice Johnson",
    createdAt: "2024-01-16",
    approved: true,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const postComments = comments.filter((comment) => comment.postId === postId && comment.approved)

    return NextResponse.json(postComments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newComment = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      approved: true, // In a real app, you might want moderation
    }

    comments.push(newComment)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
