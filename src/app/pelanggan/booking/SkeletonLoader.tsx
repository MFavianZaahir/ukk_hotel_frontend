import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SkeletonLoader() {
  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <div className="h-8 w-64 bg-gray-800 rounded mb-8 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 h-[500px]">
              <CardHeader>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}