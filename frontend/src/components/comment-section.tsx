"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, Lock, MessageCircle, Reply, Trash2, Heart, Flag } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { apiClient, type ApiComment } from "@/lib/api"

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<ApiComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const { user, isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const commentsData = await apiClient.getComments(postId)
        setComments(commentsData)
      } catch (err) {
        console.error("Error fetching comments:", err)
        setError("Failed to load comments")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const commentData = {
        content: newComment.trim(),
        postId,
      }

      const createdComment = await apiClient.createComment(commentData)
      setComments([createdComment, ...comments])
      setNewComment("")
    } catch (err) {
      console.error("Error creating comment:", err)
      setError("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const commentData = {
        content: replyContent.trim(),
        postId,
        parentId,
      }

      const createdComment = await apiClient.createComment(commentData)
      setComments([createdComment, ...comments])
      setReplyContent("")
      setReplyingTo(null)
    } catch (err) {
      console.error("Error creating reply:", err)
      setError("Failed to post reply. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await apiClient.deleteComment(commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
    } catch (err) {
      console.error("Error deleting comment:", err)
      setError("Failed to delete comment")
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

  const isCommentAuthor = (comment: ApiComment): boolean => {
    if (!user || !comment.author) return false
    if (typeof comment.author === "string") return false
    return comment.author.id === user.id || comment.author.email === user.email
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

  if (loading) {
    return (
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    {user?.role === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          ) : (
            <Alert className="mb-6">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                You need to be logged in to post a comment.{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>{" "}
                or{" "}
                <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                  create an account
                </Link>{" "}
                to join the discussion.
              </AlertDescription>
            </Alert>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={getAuthorName(comment.author)} />
                      <AvatarFallback className="text-sm">{getAuthorInitials(comment.author)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{getAuthorName(comment.author)}</span>
                        {typeof comment.author === "object" && comment.author?.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays className="w-3 h-3" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{comment.content}</p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4">
                        <button disabled className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                          <Heart className="w-3 h-3" />
                          Like
                        </button>
                        {isAuthenticated && (
                          <button  disabled
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        )}
                        <button disabled className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                          <Flag className="w-3 h-3" />
                          Report
                        </button>
                        {(isAdmin || isCommentAuthor(comment)) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                              <AvatarFallback>
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder={`Reply to ${getAuthorName(comment.author)}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={2}
                                className="resize-none text-sm"
                              />
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleReply(comment.id)}
                                  disabled={isSubmitting || !replyContent.trim()}
                                >
                                  {isSubmitting ? "Replying..." : "Reply"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyContent("")
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
