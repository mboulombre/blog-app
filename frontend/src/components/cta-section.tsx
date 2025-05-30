import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CTASection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/imageb.png?height=500&width=600"
              alt="POS System Dashboard"
              width={600}
              height={500}
              className="rounded-lg shadow-2xl"
            />
          </div>

          <div className="lg:pl-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Maximize Efficiency
              <br />
              <span className="text-blue-600">-Boost Sales</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Upgrade Your Business Today! Streamline Sales, Manage Inventory, and Delight Customers with Our POS
              System. Experience the difference with our comprehensive solution designed for modern businesses.
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
