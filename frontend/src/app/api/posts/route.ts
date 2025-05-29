import { NextResponse } from "next/server"

// Mock database
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
  {
    id: "2",
    title: "The Future of Web Development",
    excerpt: "Exploring emerging trends and technologies that will shape the future of web development.",
    content: "Full content here...",
    author: "Jane Smith",
    createdAt: "2024-01-14",
    tags: ["Technology", "Trends", "Future"],
    published: true,
  },
]

export async function GET() {
  try {
    // Filter only published posts for public API
    const publishedPosts = posts.filter((post) => post.published)
    return NextResponse.json(publishedPosts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, you would validate the user is authenticated
    // and save to a database
    const newPost = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      author: "Current User", // This would come from auth
    }

    posts.push(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
