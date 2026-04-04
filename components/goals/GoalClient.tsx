'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { GoalWithSteps } from '@/types/database.types'
import type { GoalInput, GoalStepInput } from '@/lib/validations/goal'
import { createGoal, updateGoal, deleteGoal, createGoalStep, toggleGoalStep, deleteGoalStep } from '@/actions/goals'
import { GoalList } from './GoalList'
import { GoalForm } from './GoalForm'
import { GoalStepForm } from './GoalStepForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Target } from 'lucide-react'

interface GoalClientProps {
  goals: GoalWithSteps[]
}

export function GoalClient({ goals }: GoalClientProps) {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<GoalWithSteps | null>(null)
  const [addingStepToGoalId, setAddingStepToGoalId] = useState<string | null>(null)

  const handleCreateGoal = async (data: GoalInput) => {
    const result = await createGoal(data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Goal created successfully')
    setIsGoalModalOpen(false)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleUpdateGoal = async (data: GoalInput) => {
    if (!editingGoal) return

    const result = await updateGoal(editingGoal.id, data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Goal updated successfully')
    setIsGoalModalOpen(false)
    setEditingGoal(null)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDeleteGoal = async (id: string) => {
    const result = await deleteGoal(id)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Goal deleted successfully')
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleCreateStep = async (data: GoalStepInput) => {
    const result = await createGoalStep(data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Step added successfully')
    setAddingStepToGoalId(null)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleToggleStep = async (stepId: string, completed: boolean) => {
    const result = await toggleGoalStep(stepId, completed)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDeleteStep = async (stepId: string) => {
    const result = await deleteGoalStep(stepId)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Step deleted successfully')
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleOpenCreateModal = () => {
    setEditingGoal(null)
    setIsGoalModalOpen(true)
  }

  const handleEditGoal = (goal: GoalWithSteps) => {
    setEditingGoal(goal)
    setIsGoalModalOpen(true)
  }

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false)
    setEditingGoal(null)
  }

  const handleAddStep = (goalId: string) => {
    setAddingStepToGoalId(goalId)
  }

  const handleCancelAddStep = () => {
    setAddingStepToGoalId(null)
  }

  return (
    <>
      <PageHeader
        title="Goals"
        action={{
          label: 'Add Goal',
          onClick: handleOpenCreateModal,
        }}
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Set your first goal and break it down into achievable steps"
          action={{
            label: 'Create Goal',
            onClick: handleOpenCreateModal,
          }}
        />
      ) : (
        <GoalList
          goals={goals}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
          onToggleStep={handleToggleStep}
          onDeleteStep={handleDeleteStep}
          onAddStep={handleAddStep}
          addingStepToGoalId={addingStepToGoalId}
          onCreateStep={handleCreateStep}
          onCancelAddStep={handleCancelAddStep}
        />
      )}

      <Modal
        isOpen={isGoalModalOpen}
        onClose={handleCloseGoalModal}
        title={editingGoal ? 'Edit Goal' : 'Create Goal'}
      >
        <GoalForm
          onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
          onCancel={handleCloseGoalModal}
          initialData={editingGoal || undefined}
        />
      </Modal>
    </>
  )
}
