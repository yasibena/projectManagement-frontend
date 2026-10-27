import Sidebar from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#F7F8FA]">
        {children}
      </main>
    </div>
  )
}
