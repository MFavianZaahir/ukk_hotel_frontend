import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Wikusama Hotel</h3>
            <p className="text-sm">Providing luxury and comfort since 2024</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/rooms">Rooms</Link></li>
              <li><Link href="/booking">Book Now</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm">123 Hotel Street, City, Country</p>
            <p className="text-sm">Phone: +1 234 567 890</p>
            <p className="text-sm">Email: info@wikusamahotel.com</p>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-500">
                <Facebook />
              </a>
              <a href="#" className="text-white hover:text-blue-500">
                <Twitter />
              </a>
              <a href="#" className="text-white hover:text-blue-500">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          © 2024 Wikusama Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  )
}