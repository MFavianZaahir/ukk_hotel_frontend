import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bed, Users, Home, LayoutDashboard, LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <nav className="bg-gray-800 w-64 p-6 space-y-6">
        {/* <Link href="/admin" className="text-2xl font-bold">Hello Admin!</Link> */}
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/kamar" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Bed size={20} />
              <span>Rooms</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/tipe-kamar" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Home size={20} />
              <span>Room Types</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Users size={20} />
              <span>Users</span>
            </Link>
          </li>
        </ul>
        {/* <div className="pt-2">
          <Button variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div> */}
      </nav>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
