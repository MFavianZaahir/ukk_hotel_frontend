import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserList from './components/UserList'
import CustomerList from './components/CustomerList'
import CreateSidebar from './components/CreateSidebar'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 p-10">

        <Tabs defaultValue="users">
          {/* Flex container for tabs and button */}
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            {/* Create User/Customer button aligned to the right */}
            <CreateSidebar>
              <Button className="bg-blue-600 hover:bg-blue-500">
                <UserPlus className="mr-2 h-4 w-4" /> Create User/Customer
              </Button>
            </CreateSidebar>
          </div>

          {/* Tabs Content */}
          <TabsContent value="users">
            <Suspense fallback={<div className="text-center">Loading users...</div>}>
              <UserList />
            </Suspense>
          </TabsContent>
          <TabsContent value="customers">
            <Suspense fallback={<div className="text-center">Loading customers...</div>}>
              <CustomerList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
