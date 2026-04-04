'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Package } from 'lucide-react'
import type { Essential } from '@/types/database.types'
import type { EssentialInput } from '@/lib/validations/essential'
import { createEssential, updateEssential, deleteEssential } from '@/actions/essentials'
import { EssentialsGrid } from './EssentialsGrid'
import { EssentialForm } from './EssentialForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'

interface EssentialClientProps {
  essentials: Essential[]
}

export function EssentialClient({ essentials }: EssentialClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEssential, setEditingEssential] = useState<Essential | null>(null)

  const handleCreateEssential = async (data: EssentialInput) => {
    const result = await createEssential(data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Essential created successfully')
    setIsModalOpen(false)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleUpdateEssential = async (data: EssentialInput) => {
    if (!editingEssential) return

    const result = await updateEssential(editingEssential.id, data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Essential updated successfully')
    setIsModalOpen(false)
    setEditingEssential(null)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDeleteEssential = async (id: string) => {
    const result = await deleteEssential(id)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Essential deleted successfully')
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleOpenCreateModal = () => {
    setEditingEssential(null)
    setIsModalOpen(true)
  }

  const handleEditEssential = (essential: Essential) => {
    setEditingEssential(essential)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEssential(null)
  }

  return (
    <>
      <PageHeader
        title="School Essentials"
        action={{
          label: 'Add Essential',
          onClick: handleOpenCreateModal,
        }}
      />

      {essentials.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No essentials yet"
          description="Add recommended school products and items you need for your academic life"
          action={{
            label: 'Add Essential',
            onClick: handleOpenCreateModal,
          }}
        />
      ) : (
        <EssentialsGrid
          essentials={essentials}
          onEdit={handleEditEssential}
          onDelete={handleDeleteEssential}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEssential ? 'Edit Essential' : 'Add Essential'}
      >
        <EssentialForm
          onSubmit={editingEssential ? handleUpdateEssential : handleCreateEssential}
          onCancel={handleCloseModal}
          initialData={editingEssential || undefined}
        />
      </Modal>
    </>
  )
}
