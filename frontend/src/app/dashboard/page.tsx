"use client"
import AdminSidebar from "@/components/admin-sidebar"
import DashboardContent from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64">
        <DashboardContent />
      </main>
    </div>
  )
}
