'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { CheckSquare } from 'lucide-react'
import type { Todo } from '@/types/database.types'

interface TodoPreviewProps {
  todos: Todo[]
}

export function TodoPreview({ todos }: TodoPreviewProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-playfair text-space-cadet">Today&apos;s Tasks</h2>
        <Link href="/tasks" className="text-sm text-slate-gray hover:text-space-cadet">
          View all
        </Link>
      </div>
      {todos.length > 0 ? (
        <div className="space-y-2">
          {todos.map((todo) => (
            <Card key={todo.id} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border-2 border-slate-gray" />
              <div className="flex-1">
                <p className="text-space-cadet">{todo.title}</p>
                <span className="text-xs text-slate-gray capitalize">{todo.tag}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8">
          <EmptyState
            icon={CheckSquare}
            title="No tasks for today"
            description="Create your first task to get started"
            action={{
              label: 'Create task',
              onClick: () => {
                window.location.href = '/tasks'
              },
            }}
          />
        </Card>
      )}
    </div>
  )
}
