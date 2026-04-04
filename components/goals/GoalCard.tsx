'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { GoalWithSteps } from '@/types/database.types'
import type { GoalStepInput } from '@/lib/validations/goal'
import { Card } from '@/components/ui/Card'
import { GoalStepItem } from './GoalStepItem'
import { GoalStepForm } from './GoalStepForm'

interface GoalCardProps {
  goal: GoalWithSteps
  onEdit?: (goal: GoalWithSteps) => void
  onDelete?: (id: string) => Promise<void>
  onToggleStep?: (stepId: string, completed: boolean) => Promise<void>
  onDeleteStep?: (stepId: string) => Promise<void>
  onAddStep?: (goalId: string) => void
  isAddingStep?: boolean
  onCreateStep?: (data: GoalStepInput) => Promise<void>
  onCancelAddStep?: () => void
}

/**
 * Calculate goal progress as percentage of completed steps
 * Returns 0 if no steps exist, otherwise (completed / total) * 100
 */
export function calculateProgress(steps: { completed: boolean }[]): number {
  if (steps.length === 0) return 0
  const completedSteps = steps.filter(step => step.completed).length
  return Math.round((completedSteps / steps.length) * 100)
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onToggleStep,
  onDeleteStep,
  onAddStep,
  isAddingStep,
  onCreateStep,
  onCancelAddStep,
}: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpansion = () => {
    setIsExpanded(prev => !prev)
  }

  const completedSteps = goal.steps.filter(s => s.completed).length
  const totalSteps = goal.steps.length

  return (
    <Card className="overflow-hidden">
      {/* Goal Header - Always Visible */}
      <button
        onClick={toggleExpansion}
        className="w-full text-left"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} goal: ${goal.title}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-space-cadet flex-1">
            {goal.title}
          </h3>
          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-gray flex-shrink-0" />
          ) : (
            <ChevronDown size={20} className="text-slate-gray flex-shrink-0" />
          )}
        </div>

        {/* Progress Bar - Collapsed State */}
        {!isExpanded && (
          <div className="space-y-1">
            <div className="w-full bg-slate-gray/20 rounded-full h-2">
              <div
                className="bg-space-cadet h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
                role="progressbar"
                aria-valuenow={goal.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-slate-gray">
              {goal.progress}% complete ({completedSteps}/{totalSteps} steps)
            </p>
          </div>
        )}
      </button>

      {/* Expanded Content - Steps List */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-gray/20">
          {/* Progress Bar - Expanded State */}
          <div className="mb-4 space-y-1">
            <div className="w-full bg-slate-gray/20 rounded-full h-2">
              <div
                className="bg-space-cadet h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
                role="progressbar"
                aria-valuenow={goal.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-slate-gray">
              {goal.progress}% complete ({completedSteps}/{totalSteps} steps)
            </p>
          </div>

          {/* Steps List */}
          {goal.steps.length === 0 ? (
            <p className="text-sm text-slate-gray mb-4">No steps yet. Add your first step!</p>
          ) : (
            <div className="space-y-2 mb-4">
              {goal.steps.map(step => (
                <GoalStepItem
                  key={step.id}
                  step={step}
                  onToggle={async (stepId, completed) => {
                    if (onToggleStep) {
                      await onToggleStep(stepId, completed)
                    }
                  }}
                  onDelete={async (stepId) => {
                    if (onDeleteStep) {
                      await onDeleteStep(stepId)
                    }
                  }}
                />
              ))}
            </div>
          )}

          {/* Inline Step Form */}
          {isAddingStep && onCreateStep && onCancelAddStep && (
            <GoalStepForm
              goalId={goal.id}
              onSubmit={onCreateStep}
              onCancel={onCancelAddStep}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-slate-gray/20">
            <button
              onClick={() => onAddStep?.(goal.id)}
              className="flex-1 px-3 py-2 bg-space-cadet text-cream rounded-[10px] text-sm font-medium hover:bg-space-cadet/90"
              disabled={isAddingStep}
            >
              Add Step
            </button>
            <button
              onClick={() => onEdit?.(goal)}
              className="px-3 py-2 bg-slate-gray text-cream rounded-[10px] text-sm font-medium hover:bg-slate-gray/90"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(goal.id)}
              className="px-3 py-2 bg-caput text-cream rounded-[10px] text-sm font-medium hover:bg-caput/90"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
