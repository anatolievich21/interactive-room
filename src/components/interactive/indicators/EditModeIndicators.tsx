import { useCallback, useState } from 'react'
import { highlightStorage } from '../../../utils/highlightStorage'
import './EditModeIndicators.css'

interface EditModeIndicatorsProps {
    isEditMode: boolean
}

export function EditModeIndicators({ isEditMode }: EditModeIndicatorsProps) {
    const [showNotification, setShowNotification] = useState(false)

    const handleResetPositions = useCallback(() => {
        highlightStorage.resetPositions()
        window.location.reload()
    }, [])

    const handleSavePositions = useCallback(() => {
        highlightStorage.saveCurrentPositionsAsDefault()
        setShowNotification(true)

        setTimeout(() => {
            setShowNotification(false)
        }, 2000)
    }, [])

    if (!isEditMode) return null

    return (
        <>
            <div className="edit-mode-indicator">
                <div className="edit-mode-badge">
                    ✏️ Edit mode enabled
                </div>
            </div>

            <div className="edit-controls">
                <button
                    className="edit-control-btn save-btn"
                    onClick={handleSavePositions}
                    title="Save positions"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17,21 17,13 7,13 7,21" />
                        <polyline points="7,3 7,8 15,8" />
                    </svg>
                    Save
                </button>

                <button
                    className="edit-control-btn reset-btn"
                    onClick={handleResetPositions}
                    title="Reset all positions"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                    </svg>
                    Reset
                </button>
            </div>

            {showNotification && (
                <div className="save-notification">
                    <div className="notification-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17L4 12" />
                        </svg>
                        Positions saved as defaults!
                    </div>
                </div>
            )}
        </>
    )
} 