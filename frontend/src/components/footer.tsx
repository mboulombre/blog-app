import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerSections = [
  {
    title: "Customers",
    links: [
      { name: "Small Business", href: "/customers/small-business" },
      { name: "Enterprise", href: "/customers/enterprise" },
      { name: "Retail", href: "/customers/retail" },
      { name: "Restaurant", href: "/customers/restaurant" },
      { name: "Trusted Central", href: "/customers/trusted-central" },
    ],
  },
  {
    title: "Products",
    links: [
      { name: "POS Systems", href: "/products/pos-systems" },
      { name: "Software", href: "/products/software" },
      { name: "Hardware", href: "/products/hardware" },
      { name: "Integrations", href: "/products/integrations" },
      { name: "Payment Plans", href: "/products/payment-plans" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Resource Center", href: "/resources" },
      { name: "Help Center", href: "/help" },
      { name: "Webinars", href: "/webinars" },
      { name: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Partners", href: "/partners" },
      { name: "Investors", href: "/investors" },
      { name: "Licenses", href: "/licenses" },
      { name: "Leadership Team", href: "/leadership" },
    ],
  },
  {
    title: "Compare",
    links: [
      { name: "vs Square", href: "/compare/square" },
      { name: "vs Shopify", href: "/compare/shopify" },
      { name: "vs Toast", href: "/compare/toast" },
      { name: "vs Clover", href: "/compare/clover" },
      { name: "vs Revel", href: "/compare/revel" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="mb-16">
          <div className="max-w-md">
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to get the latest Tumbas news, updates, and resources delivered directly to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold">Tumbas</span>
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
              <span>© 2024. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
