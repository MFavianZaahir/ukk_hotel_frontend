import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerActions from './CustomerActions'

async function getCustomers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/customer`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch customers')
    return res.json()
  } catch (error) {
    console.error('Error fetching customers:', error)
    return { data: [] }
  }
}

export default async function CustomerList() {
  const { data: customers = [] } = await getCustomers()

  if (customers.length === 0) {
    return <div className="text-center text-white">No customers found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <Card key={customer?.id_pelanggan ?? 'unknown'} className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">{customer?.nama ?? 'Unknown Name'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                src={customer?.foto ?? '/placeholder.svg?height=64&width=64'}
                alt={customer?.nama ?? 'Customer'}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-400">{customer?.email ?? 'No email provided'}</p>
                <p className="text-sm font-medium text-gray-400">Customer</p>
              </div>
            </div>
            <CustomerActions customer={customer} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}