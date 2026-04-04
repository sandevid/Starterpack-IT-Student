'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Todo } from '@/types/database.types'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  inProgressTodos: Todo[]
  completedTodos: Todo[]
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => Promise<void>
}

export function TodoList({ inProgressTodos, completedTodos, onToggle, onEdit, onDelete }: TodoListProps) {
  const [isDoneCollapsed, setIsDoneCollapsed] = useState(false)

  return (
    <div className="space-y-4">
      {/* In Progress Section */}
      <div>
        <h2 className="text-lg font-semibold text-space-cadet mb-3">
          In Progress ({inProgressTodos.length})
        </h2>
        {inProgressTodos.length === 0 ? (
          <p className="text-slate-gray text-sm">No tasks in progress</p>
        ) : (
          <div className="space-y-2">
            {inProgressTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Done Section (Collapsible) */}
      <div>
        <button
          onClick={() => setIsDoneCollapsed(!isDoneCollapsed)}
          className="w-full flex items-center justify-between text-lg font-semibold text-space-cadet mb-3"
        >
          <span>Done ({completedTodos.length})</span>
          {isDoneCollapsed ? (
            <ChevronDown size={20} className="text-slate-gray" />
          ) : (
            <ChevronUp size={20} className="text-slate-gray" />
          )}
        </button>
        
        {!isDoneCollapsed && (
          <>
            {completedTodos.length === 0 ? (
              <p className="text-slate-gray text-sm">No completed tasks</p>
            ) : (
              <div className="space-y-2">
                {completedTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {isDoneCollapsed && completedTodos.length > 0 && (
          <p className="text-slate-gray text-sm">
            {completedTodos.length} {completedTodos.length === 1 ? 'item' : 'items'} hidden
          </p>
        )}
      </div>
    </div>
  )
}
