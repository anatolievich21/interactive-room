import { useCallback, forwardRef } from 'react'
import './BurgerButton.css'

interface BurgerButtonProps {
    onClick?: () => void
    isExpanded?: boolean
}

export const BurgerButton = forwardRef<HTMLButtonElement, BurgerButtonProps>(
    ({ onClick, isExpanded = false }, ref) => {
        const handleClick = useCallback(() => {
            onClick?.()
        }, [onClick])

        return (
            <button
                ref={ref}
                className={`burger-button ${isExpanded ? 'expanded' : ''}`}
                onClick={handleClick}
                aria-label="Toggle navigation map"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        )
    }
)

BurgerButton.displayName = 'BurgerButton' 