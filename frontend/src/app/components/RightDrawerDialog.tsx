import type React from 'react'
import type { ReactNode } from 'react'

interface RightDrawerDialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const RightDrawerDialog: React.FC<RightDrawerDialogProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-10 flex justify-end overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500 opacity-50"
            onClick={onClose}
          />

          <div
            className={`pointer-events-auto relative w-screen max-w-xl bg-gray-100 shadow-xl dark:bg-gray-900 ${
              isOpen
                ? 'translate-x-0 animate-slide-in-right opacity-100'
                : 'translate-x-full opacity-0'
            }`}
          >
            <div className="px-4 pt-4 text-right">
              <button
                type="button"
                onClick={onClose}
                className="text-4xl text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default RightDrawerDialog
