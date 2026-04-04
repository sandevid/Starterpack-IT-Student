import Link from 'next/link'
import { CheckSquare, Target, Calendar as CalendarIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface StatsCardsProps {
  todoCount: number
  goalCount: number
  eventCount: number
}

export function StatsCards({ todoCount, goalCount, eventCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <Link href="/tasks">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CheckSquare className="mx-auto mb-2 text-space-cadet" size={24} />
          <p className="text-2xl font-bold text-space-cadet">{todoCount}</p>
          <p className="text-xs text-slate-gray">Tasks</p>
        </Card>
      </Link>
      <Link href="/goals">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <Target className="mx-auto mb-2 text-space-cadet" size={24} />
          <p className="text-2xl font-bold text-space-cadet">{goalCount}</p>
          <p className="text-xs text-slate-gray">Goals</p>
        </Card>
      </Link>
      <Link href="/calendar">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CalendarIcon className="mx-auto mb-2 text-space-cadet" size={24} />
          <p className="text-2xl font-bold text-space-cadet">{eventCount}</p>
          <p className="text-xs text-slate-gray">Events</p>
        </Card>
      </Link>
    </div>
  )
}
