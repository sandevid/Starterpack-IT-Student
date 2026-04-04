'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Todo, TodoTag } from '@/types/database.types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => Promise<void>
}

// Tag color mapping
const tagColors: Record<TodoTag, string> = {
  math: 'bg-blue-100 text-blue-700',
  english: 'bg-purple-100 text-purple-700',
  science: 'bg-green-100 text-green-700',
  ipa: 'bg-orange-100 text-orange-700',
  ips: 'bg-pink-100 text-pink-700',
  general: 'bg-gray-100 text-gray-700',
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle(todo.id, !todo.completed)
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      try {
        await onDelete(todo.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-[14px] p-4 flex items-start gap-3">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isToggling}
        className="mt-1 w-5 h-5 rounded border-slate-gray/30 text-space-cadet focus:ring-space-cadet cursor-pointer disabled:opacity-50"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-space-cadet break-words ${
            todo.completed ? 'line-through opacity-60' : ''
          }`}
        >
          {todo.title}
        </p>
        <span
          className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-medium ${
            tagColors[todo.tag]
          }`}
        >
          {todo.tag}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(todo)}
          disabled={isDeleting}
          className="text-slate-gray hover:text-space-cadet transition-colors disabled:opacity-50"
          aria-label="Edit task"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-slate-gray hover:text-caput transition-colors disabled:opacity-50"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
