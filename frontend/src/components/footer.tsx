import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-semibold">D-Tech</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <div className="flex gap-4">
                <Link href="/instagram" className="hover:text-white transition-colors">
                  Instagram
                </Link>
                <Link href="/twitter" className="hover:text-white transition-colors">
                  Twitter
                </Link>
                <Link href="/facebook" className="hover:text-white transition-colors">
                  Facebook
                </Link>
                <Link href="/linkedin" className="hover:text-white transition-colors">
                  LinkedIn
                </Link>
              </div>
              <span>© 2025. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
