import { useCallback } from 'react'
import './HelpButton.css'

interface HelpButtonProps {
    onClick?: () => void
}

export function HelpButton({ onClick }: HelpButtonProps) {
    const handleClick = useCallback(() => {
        onClick?.()
    }, [onClick])

    return (
        <button
            className="help-button"
            onClick={handleClick}
            aria-label="Show help"
            title="Help"
        >
            ?
        </button>
    )
} 