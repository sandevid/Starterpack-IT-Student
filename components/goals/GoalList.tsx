'use client'

import type { GoalWithSteps } from '@/types/database.types'
import type { GoalStepInput } from '@/lib/validations/goal'
import { GoalCard } from './GoalCard'

interface GoalListProps {
  goals: GoalWithSteps[]
  onEdit?: (goal: GoalWithSteps) => void
  onDelete?: (id: string) => Promise<void>
  onToggleStep?: (stepId: string, completed: boolean) => Promise<void>
  onDeleteStep?: (stepId: string) => Promise<void>
  onAddStep?: (goalId: string) => void
  addingStepToGoalId?: string | null
  onCreateStep?: (data: GoalStepInput) => Promise<void>
  onCancelAddStep?: () => void
}

export function GoalList({ 
  goals, 
  onEdit, 
  onDelete, 
  onToggleStep, 
  onDeleteStep,
  onAddStep,
  addingStepToGoalId,
  onCreateStep,
  onCancelAddStep
}: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-gray">No goals yet. Create your first goal to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {goals.map(goal => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStep={onToggleStep}
          onDeleteStep={onDeleteStep}
          onAddStep={onAddStep}
          isAddingStep={addingStepToGoalId === goal.id}
          onCreateStep={onCreateStep}
          onCancelAddStep={onCancelAddStep}
        />
      ))}
    </div>
  )
}
