"use client"

import { useState } from "react"
import HeroSection from "@/components/hero-section"
import RecentArticles from "@/components/recent-articles"
import TrendingSection from "@/components/trending-section"
import TipsSection from "@/components/tips-section"
import CTASection from "@/components/cta-section"
import PostList from "@/components/post-list"

export default function HomePage() {
  const [showAllPosts, setShowAllPosts] = useState(false)

  return (
    <div className="bg-gray-50">
      <HeroSection />
      <RecentArticles />

      {/* Toggle between recent articles and all posts */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{showAllPosts ? "All Posts" : "Featured Content"}</h2>
            <button
              onClick={() => setShowAllPosts(!showAllPosts)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllPosts ? "Show Featured" : "View All Posts"}
            </button>
          </div>

          {showAllPosts ? (
            <PostList />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TipsSection />
              </div>
              <div>
                <TrendingSection />
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  )
}
