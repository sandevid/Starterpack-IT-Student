import { BottomNav } from '@/components/BottomNav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream">
      <main className="pb-20 px-4 pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
