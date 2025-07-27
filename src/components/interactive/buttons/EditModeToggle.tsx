import { useCallback } from 'react'
import './ButtonBase.css'
import './EditModeToggle.css'

interface EditModeToggleProps {
    isEditMode: boolean
    onToggle: (isEditMode: boolean) => void
}

export function EditModeToggle({ isEditMode, onToggle }: EditModeToggleProps) {
    const handleToggle = useCallback(() => {
        onToggle(!isEditMode)
    }, [isEditMode, onToggle])

    return (
        <button
            className={`button-base edit-mode-toggle ${isEditMode ? 'active' : ''}`}
            onClick={handleToggle}
            title={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        </button>
    )
} 