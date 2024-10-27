import Sidebar from './components/Sidebar'

export default function PelangganLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}