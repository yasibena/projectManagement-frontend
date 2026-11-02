import Sidebar from "@/components/dashboard/Sidebar"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#F7F8FA]">
        <div className="flex justify-end px-3 pt-3 sm:px-6">
          <LanguageSwitcher />
        </div>
        {children}
      </main>
    </div>
  )
}
