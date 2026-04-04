'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Todo } from '@/types/database.types'
import type { TodoInput } from '@/lib/validations/todo'
import { createTodo, updateTodo, toggleTodo, deleteTodo } from '@/actions/todos'
import { TodoList } from './TodoList'
import { TodoForm } from './TodoForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface TodoClientProps {
  inProgressTodos: Todo[]
  completedTodos: Todo[]
}

export function TodoClient({ inProgressTodos, completedTodos }: TodoClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const handleCreate = async (data: TodoInput) => {
    const result = await createTodo(data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Task created successfully')
    setIsModalOpen(false)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleUpdate = async (data: TodoInput) => {
    if (!editingTodo) return

    const result = await updateTodo(editingTodo.id, data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Task updated successfully')
    setIsModalOpen(false)
    setEditingTodo(null)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleToggle = async (id: string, completed: boolean) => {
    const result = await toggleTodo(id, completed)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteTodo(id)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Task deleted successfully')
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTodo(null)
  }

  const handleOpenCreateModal = () => {
    setEditingTodo(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-playfair text-space-cadet">Tasks</h1>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus size={20} />
          Add Task
        </Button>
      </div>

      <TodoList
        inProgressTodos={inProgressTodos}
        completedTodos={completedTodos}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTodo ? 'Edit Task' : 'Create Task'}
      >
        <TodoForm
          onSubmit={editingTodo ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
          initialData={editingTodo || undefined}
        />
      </Modal>
    </>
  )
}
