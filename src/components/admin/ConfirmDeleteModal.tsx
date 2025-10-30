"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, Trash2 } from "lucide-react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  isLoading?: boolean
}

export const ConfirmDeleteModal = ({
  isOpen,
  title = "Delete item",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-gray-700 leading-6">{description}</p>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


