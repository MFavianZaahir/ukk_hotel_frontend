import Link from 'next/link'
import { Home, Calendar, CreditCard, User } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-4">
        <Link href="/pelanggan/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/pelanggan/booking" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <Calendar className="h-5 w-5" />
          <span>Bookings</span>
        </Link>
        <Link href="/pelanggan/profile/transactions" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <CreditCard className="h-5 w-5" />
          <span>Payments</span>
        </Link>
        {/* <Link href="/pelanggan/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link> */}
      </nav>
    </div>
  )
}