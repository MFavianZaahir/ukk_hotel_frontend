import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bed, Users, Calendar, Star } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const features = [
    { name: "Luxurious Rooms", icon: Bed, description: "Experience comfort in our well-appointed rooms" },
    { name: "24/7 Service", icon: Users, description: "Our staff is always ready to assist you" },
    { name: "Easy Booking", icon: Calendar, description: "Book your stay with just a few clicks" },
    { name: "Top Rated", icon: Star, description: "Consistently rated 5 stars by our guests" },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Wikusama Hotel</h1>
      <p className="text-xl text-center mb-12">Experience luxury and comfort in the heart of the city</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="bg-gray-800">
            <CardHeader className="flex flex-col items-center">
              <feature.icon className="h-12 w-12 mb-4 text-blue-500" />
              <CardTitle className="text-xl text-center">{feature.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Link href="/booking">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  )
}